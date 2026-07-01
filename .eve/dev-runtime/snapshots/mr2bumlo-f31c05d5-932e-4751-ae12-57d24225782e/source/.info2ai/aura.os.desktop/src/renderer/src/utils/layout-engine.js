/**
 * Layout Engine — Row-packing auto-layout for canvas widgets.
 *
 * Places widgets left-to-right in rows, wrapping when the row exceeds
 * MAX_ROW_WIDTH. Guarantees no overlap by construction.
 */

const DEFAULTS = {
  gap: 24,
  originX: 60,
  originY: 60,
  maxRowWidth: 1400,
  gridSize: 12
}

/**
 * Snap a value to the nearest grid line.
 */
export function snapToGrid(val, gridSize = DEFAULTS.gridSize) {
  return Math.round(val / gridSize) * gridSize
}

/**
 * Check if two rectangles overlap (with gap padding).
 */
function rectsOverlap(a, b, gap = DEFAULTS.gap) {
  return !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  )
}

/**
 * Compute full layout for all widgets using row-packing.
 * Widgets keep their existing order (array index = creation order).
 *
 * @param {Array<{id: any, w: number, h: number}>} widgets
 * @param {object} config  Optional overrides for gap, originX, originY, maxRowWidth
 * @returns {Array<{id: any, x: number, y: number}>}  Positions for each widget
 */
export function computeLayout(widgets, config = {}) {
  const { gap, originX, originY, maxRowWidth } = { ...DEFAULTS, ...config }

  const positions = []
  let cursorX = originX
  let cursorY = originY
  let rowHeight = 0

  for (const widget of widgets) {
    const w = widget.w || 300
    const h = widget.h || 300

    // Wrap to next row if this widget would exceed max row width
    if (cursorX > originX && cursorX + w > originX + maxRowWidth) {
      cursorX = originX
      cursorY += rowHeight + gap
      rowHeight = 0
    }

    positions.push({
      id: widget.id,
      x: snapToGrid(cursorX),
      y: snapToGrid(cursorY)
    })

    cursorX += w + gap
    rowHeight = Math.max(rowHeight, h)
  }

  return positions
}

/**
 * Find the next available position for a single new widget,
 * given the existing widgets already on the canvas.
 *
 * @param {Array<{id, x, y, w, h}>} existingWidgets  Current widgets with positions
 * @param {{w: number, h: number}} newWidget  The widget to place
 * @param {object} config  Optional overrides
 * @returns {{x: number, y: number}}
 */
export function findNextPosition(existingWidgets, newWidget, config = {}) {
  const { gap, originX, originY, maxRowWidth } = { ...DEFAULTS, ...config }

  if (!existingWidgets.length) {
    return { x: snapToGrid(originX), y: snapToGrid(originY) }
  }

  // Compute the end of each row to find where to place next
  // Group existing widgets into rows by their y-coordinate (snapped)
  const rows = {}
  for (const w of existingWidgets) {
    const rowKey = snapToGrid(w.y)
    if (!rows[rowKey]) {
      rows[rowKey] = { y: w.y, maxH: 0, endX: 0 }
    }
    const endX = w.x + (w.w || 300) + gap
    if (endX > rows[rowKey].endX) rows[rowKey].endX = endX
    rows[rowKey].maxH = Math.max(rows[rowKey].maxH, w.h || 300)
  }

  // Sort rows by Y position
  const sortedRows = Object.values(rows).sort((a, b) => a.y - b.y)

  // Try to fit in the last row first
  const lastRow = sortedRows[sortedRows.length - 1]
  const newW = newWidget.w || 300

  if (lastRow.endX + newW <= originX + maxRowWidth) {
    // Fits in the current last row
    return {
      x: snapToGrid(lastRow.endX),
      y: snapToGrid(lastRow.y)
    }
  }

  // Start a new row below everything
  const bottomY = lastRow.y + lastRow.maxH + gap
  return {
    x: snapToGrid(originX),
    y: snapToGrid(bottomY)
  }
}

/**
 * Resolve overlap after a widget is dropped.
 * If the dropped widget overlaps any other widget, find the nearest
 * non-overlapping position by scanning right then wrapping to the next row.
 *
 * @param {object} movedWidget  The widget being moved { id, x, y, w, h }
 * @param {Array} allWidgets    All widgets on the canvas (including the moved one)
 * @param {object} config       Optional overrides
 * @returns {{x: number, y: number}}  Resolved position (may be same as input if no overlap)
 */
export function resolveOverlap(movedWidget, allWidgets, config = {}) {
  const { gap, originX, maxRowWidth, gridSize } = { ...DEFAULTS, ...config }

  const mw = movedWidget.w || 300
  const mh = movedWidget.h || 300
  const others = allWidgets.filter((w) => w.id !== movedWidget.id)

  // Check if current position has any overlap
  const candidate = { x: movedWidget.x, y: movedWidget.y, w: mw, h: mh }
  const hasOverlap = others.some((o) =>
    rectsOverlap(candidate, { x: o.x, y: o.y, w: o.w || 300, h: o.h || 300 }, gap)
  )

  if (!hasOverlap) {
    return { x: snapToGrid(movedWidget.x), y: snapToGrid(movedWidget.y) }
  }

  // Overlap detected — scan for the nearest free slot
  // Strategy: scan grid positions starting from the dropped position,
  // moving right then wrapping to next row
  const step = gridSize
  let scanX = snapToGrid(movedWidget.x)
  let scanY = snapToGrid(movedWidget.y)

  for (let attempts = 0; attempts < 200; attempts++) {
    const test = { x: scanX, y: scanY, w: mw, h: mh }
    const collides = others.some((o) =>
      rectsOverlap(test, { x: o.x, y: o.y, w: o.w || 300, h: o.h || 300 }, gap)
    )

    if (!collides) {
      return { x: scanX, y: scanY }
    }

    // Move right by one widget width + gap
    scanX += mw + gap
    scanX = snapToGrid(scanX)

    // Wrap to next row if too far right
    if (scanX + mw > originX + maxRowWidth) {
      scanX = snapToGrid(originX)
      scanY += mh + gap
      scanY = snapToGrid(scanY)
    }
  }

  // Fallback — just place below everything
  let maxBottom = 0
  for (const o of others) {
    maxBottom = Math.max(maxBottom, o.y + (o.h || 300))
  }
  return { x: snapToGrid(originX), y: snapToGrid(maxBottom + gap) }
}

/**
 * Reflow all widgets — recomputes every position from scratch.
 *
 * @param {Array<{id, w, h}>} widgets  Widgets in their desired order
 * @param {object} config  Optional overrides
 * @returns {Array<{id, x, y}>}
 */
export function reflowAll(widgets, config = {}) {
  return computeLayout(widgets, config)
}

