# Embed mode | draw.io
Embed mode allows you to integrate the draw.io editor into your own application using an iframe. When the `embed=1` URL parameter is set, the editor communicates with the parent page or opener window via `postMessage`. This mode is only supported on [https://embed.diagrams.net](https://embed.diagrams.net/).

Once the page has loaded, it sends a `ready` message to the opener or parent window. After receiving this message, the host application can send diagram data as XML or compressed XML. The editor returns XML when the user clicks _Apply_, or an empty string when the user clicks _Cancel_.

URL parameters[​](#url-parameters "Direct link to URL parameters")
------------------------------------------------------------------

The following URL parameters are available in embed mode:

*   `spin=1`: Shows a _Loading..._ spinner while waiting for diagram data. You can also pass a custom message, for example `spin=Loading+diagram...`.

*   `modified=0`: Disables the modified-state update after _Save_ is selected and enables a status message after changes are made. If set to `0`, the status bar is cleared after changes. Otherwise, the value is used as a resource key. You can also specify this setting in the [load message](#load-action).

*   `keepmodified=1`: If `modified` specifies a resource key, this parameter maintains the modified state after _Save_ is selected.

*   `libraries=1`: Enables the shape libraries in the left panel. The default is `0` (disabled).

*   `noSaveBtn=1`: Replaces the _Save_ button with a _Save and Exit_ button. You can also specify this setting in the [load message](#load-action). When this parameter is set, the `saveAndExit` parameter is ignored.

*   `saveAndExit=1`: Displays an additional _Save and Exit_ button alongside the _Save_ button. You can also specify this setting in the [load message](#load-action). If `noSaveBtn=1` is set, use `saveAndExit=0` to hide the _Save and Exit_ button.

*   `noExitBtn=1`: Hides the _Exit_ button. You can also specify this setting in the [load message](#load-action).

    **Note:** To hide all buttons in embed mode, use `saveAndExit=0&noSaveBtn=1&noExitBtn=1`.

*   `ready=message`: Specifies the message to send when the editor is ready. The default is `ready`. This parameter is ignored when the JSON protocol is used.

*   `returnbounds=1`: Returns a JSON structure with the diagram bounds immediately after receiving the diagram XML.

*   `proto=json`: Enables the [JSON protocol](#json-protocol) for message passing.

*   `configure=1`: Sends a `configure` event and waits for a `configure` action before initialising the editor. See [Configuration](#configuration).


Configuration[​](#configuration "Direct link to Configuration")
---------------------------------------------------------------

When the `configure=1` URL parameter is set, the editor sends `{event: 'configure'}` to the parent window and waits for `{action: 'configure', config: obj}` before creating the main application and sending the `init` event. The `obj` value follows the format described in [Configure the draw.io editor](https://www.drawio.com/docs/reference/configure-diagram-editor/), for example:

```
{"action": "configure", "config": {"defaultFonts": ["Humor Sans"]}}

```


In addition to the standard configuration options, the following inline embed mode options can be set via the configure message:



* Property: passiveScroll
  * Description: Enables passive scroll mode for inline embeds. Keyboard events are only handled when the graph container has focus, preventing the editor from capturing keystrokes meant for the host page. Non-zoom scroll-wheel events are forwarded to the parent frame as {event: 'scrollWheel', deltaX, deltaY} messages instead of panning the diagram. When enabled in embedInline mode, the Escape key no longer triggers the exit action.
* Property: noResizers
  * Description: Hides the bottom and right resize handles in inline embed mode. Useful when the host application controls the size of the editor container.
* Property: preserveViewState
  * Description: Preserves the original dx, dy, grid, page, fold, connect, and arrows attribute values from the loaded diagram XML when saving, instead of overwriting them with the current runtime state. This is useful in embed contexts where the host application overrides view settings (via URL parameters like grid=0, pv=0 or config defaults like defaultFoldingEnabled) that should not be persisted back to the diagram source.
* Property: useInternalClipboard
  * Description: Disables the native clipboard handler that uses a hidden contentEditable div for Ctrl+C/V/X. Instead, the original mxKeyHandler bindings are kept, which use mxClipboard for internal copy/paste. Useful in embed contexts (e.g. VS Code webviews) where native clipboard events on the hidden div do not fire.
* Property: passThroughKeys
  * Description: An array of keyboard chords the embedding host wants to handle itself instead of draw.io. Each entry is {key, ctrl, shift, alt, command} — key is matched case-insensitively against KeyboardEvent.key, ctrl matches Ctrl or Cmd, and command is an opaque string the host understands. On a match, draw.io intercepts the keydown in the capture phase, suppresses its own handling of it, and posts {event: 'shortcut', command} back to the host so the host can run the corresponding command. This lets an embedding host reclaim shortcuts (for example Ctrl+P to open the host's own quick-open) even across a cross-origin iframe, where it cannot inject its own key listener.
* Property: suppressNewWindows
  * Description: Set to true when the host blocks opening new windows or tabs (for example a VS Code webview). draw.io then avoids window.open: link clicks are reported to the host via the openLink event and are not opened locally, and the "open in new window/tab" options in the Save, Export and HTML dialogs are hidden (popupsAllowed is forced off). Printing still needs a popup/print window the host blocks, so a host using this flag should also hide the print action (for example via hideMenuItems). Can also be set with ?suppressNewWindows=1 on the iframe URL. Default false.


JSON protocol[​](#json-protocol "Direct link to JSON protocol")
---------------------------------------------------------------

When `proto=json` is set, the editor and host application exchange JSON-encoded messages via `postMessage`. This section describes the available events and actions.

### Initialisation[​](#initialisation "Direct link to Initialisation")

When the editor is ready, it sends `{event: 'init'}` and expects a [load action](#load-action) in response.

### Load action[​](#load-action "Direct link to Load action")

The `load` action provides the diagram data to the editor:

```
{"action": "load", "xml": "<mxGraphModel>...</mxGraphModel>"}

```


The `xml` value can be any supported diagram format, including:

*   Standard draw.io XML
*   SVG or PNG files with [embedded XML](https://www.drawio.com/docs/manual/export/xml-in-png/)
*   PNG data URIs with base64 encoding
*   SVG data URIs with UTF-8 or base64 encoding
*   Visio files as data URIs with a `data:application/vnd.visio;base64` prefix
*   Lucidchart and Gliffy files as JSON strings

The legacy parameter name `xmlpng` can still be used for PNG+XML data.

You can also import specific data formats using a `descriptor` object:

```
{"action": "load", "descriptor": {"format": "csv", "data": "..."}}
{"action": "load", "descriptor": {"format": "mermaid", "data": "..."}}

```


For the `mermaid` descriptor, an additional `wrap` option controls whether the converted diagram is wrapped in an editable Mermaid group — see [Mermaid descriptor options](#mermaid-descriptor-options).

The load action supports the following optional parameters:



* Parameter: autosave
  * Description: Set to 1 to enable the autosave feature.
* Parameter: modified
  * Description: Controls the modified-state behaviour. Uses the same semantics as the modified URL parameter.
* Parameter: saveAndExit
  * Description: Controls the Save and Exit button. Uses the same semantics as the saveAndExit URL parameter. URL parameters take precedence.
* Parameter: noSaveBtn
  * Description: Controls the Save button visibility. Uses the same semantics as the noSaveBtn URL parameter.
* Parameter: noExitBtn
  * Description: Controls the Exit button visibility. Uses the same semantics as the noExitBtn URL parameter.
* Parameter: title
  * Description: Displays a title in the menu bar.
* Parameter: libs
  * Description: Specifies which shape libraries to load.
* Parameter: dark
  * Description: Enables dark mode.
* Parameter: theme
  * Description: Sets the editor theme.
* Parameter: rough
  * Description: Enables sketch (hand-drawn) mode.
* Parameter: toSketch
  * Description: Converts the diagram to sketch style on load.
* Parameter: border
  * Description: Sets the border around the diagram.
* Parameter: background
  * Description: Sets the background colour.
* Parameter: viewport
  * Description: Sets the initial viewport position and scale.
* Parameter: rect
  * Description: Sets the initial visible rectangle.
* Parameter: minWidth
  * Description: Sets the minimum width for the editor canvas.
* Parameter: minHeight
  * Description: Sets the minimum height for the editor canvas.
* Parameter: scale
  * Description: Sets an exact zoom scale after loading and positions the diagram at the origin of the viewport. When provided, this takes precedence over fit and maxFitScale. Unlike fit, which computes the scale automatically, scale applies the precise value given. This is useful when the host application needs to match an external rendering scale exactly (e.g. transitioning from an SVG preview to the editor).
* Parameter: scaleBorder
  * Description: Sets the border (in screen pixels) around the diagram when using scale. Defaults to 0. Only used with scale.
* Parameter: fit
  * Description: Set to 1 to fit the diagram to the viewport after loading. Ignored when scale is provided.
* Parameter: maxFitScale
  * Description: Sets the maximum scale when fitting the diagram to the viewport. Only used with fit.
* Parameter: publishClose
  * Description: Set to 1 to change the Save and Exit button label to Publish and the Exit button label to Close.
* Parameter: sourceMetadata
  * Description: Optional. Stores a key-value pair as an attribute on the model root cell after the diagram loads. This is useful for preserving the original source data (e.g. mermaid code) in the diagram model. See Source metadata.
* Parameter: exportProtocol
  * Description: Set to true to route UI-triggered exports through the JSON protocol instead of the browser's save dialog.
* Parameter: diffSync
  * Description: Set to true to enable diff-based synchronisation. Set to {patchOnly: true} to omit full XML from autosave messages.
* Parameter: layout
  * Description: Runs a layout on the diagram after it loads. Either a preset name (verticalFlow, horizontalFlow, verticalTree, horizontalTree, radialTree, organic) or a custom-layout array using the same format as the layout action (also accepted as a JSON string). The layout runs before the sync baseline is established, so the laid-out diagram becomes the baseline and the returned load response reflects the new positions. Requires the ELK layout bundle, which loads automatically.


After the diagram loads, the editor returns a `load` event message containing diagram size information. When `diffSync` is enabled, the response includes a `checksum` field for verifying state consistency.

### Mermaid descriptor options[​](#mermaid-descriptor-options "Direct link to Mermaid descriptor options")

When loading a `mermaid` descriptor, the descriptor object accepts an additional `wrap` option:

```
{"action": "load", "descriptor": {"format": "mermaid", "data": "graph TD\n  A-->B", "wrap": true}}

```




* Property: wrap
  * Description: Set to true to wrap the converted diagram in an editable Mermaid group: a single transparentBounds group cell that carries the Mermaid source as a mermaidData attribute, so the diagram can be re-edited as Mermaid later (the group's pen handle, or double-clicking it, reopens the Mermaid editor). This matches the result of inserting Mermaid through the editor's Insert > Mermaid dialog. The wrapped group is normalised so its padded bounds start at the page origin. Defaults to false for backwards compatibility, in which case the raw converted cells are loaded as-is and are not re-editable as Mermaid.


### Source metadata[​](#source-metadata "Direct link to Source metadata")

When loading a diagram via the `descriptor` format (e.g. mermaid), you can optionally store the original source data in the diagram model by including a `sourceMetadata` object in the load message:

```
{
  "action": "load",
  "descriptor": {"format": "mermaid", "data": "graph TD\n  A-->B"},
  "sourceMetadata": {"key": "mermaidSource", "value": "graph TD\n  A-->B"}
}

```



|Property|Description                                                           |
|--------|----------------------------------------------------------------------|
|key     |The attribute name to set on the model root cell (e.g. mermaidSource).|
|value   |The attribute value to store (e.g. the original mermaid source code). |


Both `key` and `value` must be provided for the metadata to be stored. The attribute is set on the root cell of the `mxGraphModel` after the diagram has been loaded and converted, using `graph.setAttributeForCell`. This makes the metadata available in the saved XML output and can be read back by the host application.

The `sourceMetadata` parameter is optional and has no effect when omitted or when either `key` or `value` is missing.

**`sourceMetadata` vs. the Mermaid `wrap` group.** The two are independent and may be combined. `sourceMetadata` stores a single arbitrary key-value pair on the **model root cell** — a diagram-level attribute that round-trips in the saved XML — and is applied after the diagram loads regardless of `wrap`. The Mermaid descriptor's `wrap: true` option instead stores the Mermaid source on the **wrapper group cell** (as `mermaidData`) to make that group re-editable as Mermaid. So when `wrap` is omitted (the default), `sourceMetadata` is the way to preserve the original source in the model; when `wrap: true` is used, the source is already carried on the group, and `sourceMetadata` remains available for any separate host-defined metadata on the root.

### Response message format[​](#response-message-format "Direct link to Response message format")

Most response messages from the editor (including `load`, `save`, `autosave`, `fit`, and `export`) include a common set of fields that describe the current editor state:



* Field: event
  * Description: The event type (e.g. save, autosave, load, fit, export).
* Field: bounds
  * Description: The diagram bounding box in view coordinates (affected by zoom): {x, y, width, height}.
* Field: modelBounds
  * Description: The diagram bounding box in model coordinates (zoom-independent): {x, y, width, height}. Use this for sizing containers or computing layout dimensions, as the values are stable regardless of zoom level.
* Field: scale
  * Description: The current zoom scale of the view.
* Field: translate
  * Description: The current view translation: {x, y}.
* Field: pageVisible
  * Description: Whether page view is enabled.
* Field: currentPage
  * Description: Index of the currently selected page.
* Field: page
  * Description: The background page bounds.
* Field: containerSize
  * Description: The editor container dimensions: {width, height, offsetWidth, offsetHeight}.


### Autosave[​](#autosave "Direct link to Autosave")

When `autosave` is enabled in the load message, the editor sends `{event: 'autosave', xml: '...'}` whenever the diagram changes. Changes that trigger autosave include modifications to the model, grid size, shadow visibility, page format, page scale, background colour, background image, folding, math rendering, grid, guides, and page view settings.

When [diff sync](#diff-sync) is enabled, autosave messages include a `patch` field with the structural changes and a `checksum` for state verification. By default, the full `xml` is also included for convenience. Set `diffSync: {patchOnly: true}` in the load message to omit `xml` and send only the patch.

### Save and exit events[​](#save-and-exit-events "Direct link to Save and exit events")

*   **Save:** When the user clicks _Save_, the editor sends a message with `event: 'save'` and `xml: '...'` containing the current diagram XML.
*   **Save and Exit:** When the user clicks _Save and Exit_, the save message includes an additional `exit: true` property.
*   **Exit:** When the user clicks _Exit_, the editor sends `{event: 'exit', modified: boolean}`.
*   **Open Link:** When the user clicks a link in the editor, the editor sends `{event: 'openLink', href: String, target: String, allowOpener: Boolean}` and attempts to open the link in the specified target (default: `_blank`). When [`suppressNewWindows`](#configuration) is set, the editor does **not** open the link itself — the host is expected to handle it from this event.
*   **Resize:** In inline embed mode, the editor sends `{event: 'resize', fullscreen: Boolean, rect: DOMRect}` when the editor container size changes.

### Actions[​](#actions "Direct link to Actions")

The host application can send the following actions to the editor at any time:

#### merge[​](#merge "Direct link to merge")

Merges the given XML into the current diagram. The `xml` parameter can be XML or a PNG or SVG data URI.

```
{"action": "merge", "xml": "..."}

```


Returns `{event: 'merge', error: '...', message: ...}` with the incoming message and an optional error. If the merge succeeds, `error` is `null`. When [diff sync](#diff-sync) is enabled, a successful merge also resets the shadow pages used for diff computation.

#### patch[​](#patch "Direct link to patch")

Applies a diff patch to the current diagram. Requires [diff sync](#diff-sync) to be enabled. The patch format is the same structure returned in autosave messages.

```
{"action": "patch", "patch": {...}, "checksum": "optional-expected-checksum"}

```


Returns `{event: 'patch', checksum: '...', message: ...}`. If a `checksum` was provided in the action and it does not match the editor's state after applying the patch, the response includes `checksumMismatch: true`. On error, the response contains an `error` field.

#### getDiff[​](#getdiff "Direct link to getDiff")

Requests the current diff between the shadow state and the live editor state. Requires [diff sync](#diff-sync) to be enabled. If diff sync is not enabled, falls back to returning the full `xml`.

Returns `{event: 'getDiff', patch: {...}, checksum: '...'}` when diff sync is active, or `{event: 'getDiff', xml: '...'}` as a fallback.

#### resetDiff[​](#resetdiff "Direct link to resetDiff")

Resets the diff sync shadow to the current editor state. Optionally accepts `xml` to merge new data before resetting. Use this to resynchronise after a checksum mismatch.

```
{"action": "resetDiff"}
{"action": "resetDiff", "xml": "<new base XML>"}

```


Returns `{event: 'resetDiff', checksum: '...', message: ...}`. On error (when `xml` is provided), the response contains an `error` field.

#### dialog[​](#dialog "Direct link to dialog")

Displays a dialog in the editor window. Use `titleKey`, `messageKey`, and `buttonKey` instead of `title`, `message`, and `button` for translatable strings.

```
{"action": "dialog", "title": "...", "message": "...", "button": "...", "modified": true}

```


#### prompt[​](#prompt "Direct link to prompt")

Displays a prompt dialog in the editor window. Use `titleKey` and `okKey` for translatable strings.

```
{"action": "prompt", "title": "...", "ok": "...", "defaultValue": "..."}

```


Returns `{event: 'prompt', value: '...', message: ...}` when the user clicks _OK_, or `{event: 'prompt-cancel', message: ...}` when the user clicks _Cancel_ or closes the dialog.

#### template[​](#template "Direct link to template")

Shows the template dialog. This is typically sent instead of a `load` action to let the user create a diagram from a template. When the user clicks _Cancel_, an `exit` event is sent.

The template action supports the following optional parameters:



* Parameter: callback
  * Description: Set to true to receive the selected template data for validation instead of loading it directly. The callback message is {event: 'template', xml: '...', blank: boolean, name: '...', tempUrl: '...', libs: '...', builtIn: true, message: ...} where blank is true if the user selected a blank diagram.
* Parameter: templatesOnly
  * Description: Set to true to restrict the dialog to the templates view (hides the new/recent/search panels and disables the callback flow).
* Parameter: enableRecent
  * Description: Set to 1 to enable the Recent panel. The editor requests recent diagrams from the host via the remoteInvoke channel (getRecentDiagrams).
* Parameter: enableSearch
  * Description: Set to 1 to enable template search. The editor requests matches from the host via remoteInvoke (searchDiagrams).
* Parameter: enableCustomTemp
  * Description: Set to 1 to enable a Custom Templates section populated from the host via remoteInvoke (getCustomTemplates).
* Parameter: withoutType
  * Description: Set to 1 to hide the diagram-type filter in the templates dialog.
* Parameter: toSketch
  * Description: Set to true to convert the loaded template to sketch (hand-drawn) style. Only applies when callback is not set.
* Parameter: noExitOnCancel
  * Description: Set to true to prevent the editor from exiting when the user clicks Cancel. The dialog closes and the editor remains open in its current state.


When the user picks a diagram from an external source (a recent doc, a search result, or a custom template URL), the editor sends `{event: 'template', docUrl: '...', info: {...}, name: '...'}` so the host can resolve and return the diagram content.

```
{"action": "template", "noExitOnCancel": true}

```


#### layout[​](#layout "Direct link to layout")

Runs one or more layouts on the current diagram, using the same format as _Arrange > Layout > Apply_.

```
{"action": "layout", "layouts": [...]}

```


The `layouts` value is a custom-layout array (`[{layout, config}, ...]`) — see the [JSON layout specification](https://www.drawio.com/docs/reference/json-layout-specification/) for the full catalogue of layout names and per-layout options.

To run a layout automatically when the diagram is first loaded (rather than as a separate action), use the [load action](#load-action)'s `layout` parameter instead. That parameter accepts the same array, and additionally accepts a preset name (`verticalFlow`, `horizontalFlow`, `verticalTree`, `horizontalTree`, `radialTree`, `organic`). The same value is also accepted by the [`#create` URL/hash property](https://www.drawio.com/docs/reference/supported-url-parameters/) and the desktop `--layout` command-line flag.

#### draft[​](#draft "Direct link to draft")

Shows a draft recovery dialog. Returns `{event: 'draft', result: '...', message: ...}` with `result` set to `'Edit'`, `'Discard'`, or `'ignore'`. If an error occurs, the response contains `error` instead of `result`.

```
{"action": "draft", "xml": "...", "name": "...", "editKey": "...", "discardKey": "...", "ignore": true}

```


Set `ignore` to `true` to include an _Ignore_ option.

#### status[​](#status "Direct link to status")

Displays a message in the status bar. Use `messageKey` instead of `message` for translatable strings.

```
{"action": "status", "message": "...", "modified": true}

```


The optional `modified` flag updates the modified state of the editor.

#### spinner[​](#spinner "Direct link to spinner")

Shows or hides a loading spinner. Use `messageKey` instead of `message` for translatable strings.

```
{"action": "spinner", "message": "...", "show": true}

```


Set `show` to `false` to hide the spinner.

#### export[​](#export "Direct link to export")

Requests an export of the current diagram. Returns `{event: 'export', format: '...', data: '...', xml: '...', message: ...}` where `data` is a valid data URI for the requested format.

```
{"action": "export", "format": "svg"}

```


Supported formats:



* Format: xml
  * Description: Raw diagram XML only. Returns xml in the response without generating an image or SVG. This is the fastest format and is useful for retrieving the current diagram state.
* Format: json
  * Description: Structural JSON of the diagram (graph topology, labels and metadata; no styles or geometry). See the json parameters below.
* Format: svg
  * Description: SVG (default)
* Format: xmlsvg
  * Description: SVG with embedded XML
* Format: png
  * Description: PNG image
* Format: xmlpng
  * Description: PNG with embedded XML
* Format: html
  * Description: HTML embed format (legacy)
* Format: html2
  * Description: HTML embed format (current)


**Additional parameters for `png` and `xmlpng`:**



* Parameter: spin / spinKey
  * Description: Shows a spinner while the image is generated.
* Parameter: message / messageKey
  * Description: Message to display with the spinner.
* Parameter: scale
  * Description: Zoom level (default: 1).
* Parameter: layerIds
  * Description: Array of visible layer IDs.
* Parameter: pageId
  * Description: ID of the page to export.
* Parameter: currentPage
  * Description: Set to true to export the currently selected page.
* Parameter: width
  * Description: Width of the exported image in pixels.
* Parameter: border
  * Description: Border size in pixels.
* Parameter: shadow
  * Description: Set to true to apply a shadow filter.
* Parameter: grid
  * Description: Set to true to include the grid.
* Parameter: keepTheme
  * Description: Set to true to preserve the current theme (e.g. dark mode).
* Parameter: transparent
  * Description: Set to true for a transparent background.
* Parameter: background
  * Description: Background colour as a string.
* Parameter: size
  * Description: Set to page to use the page size, or diagram (default) to use the diagram bounds.
* Parameter: withSvg
  * Description: Set to true to additionally include an SVG render of the diagram in the response. The response message will then contain both data (the PNG data URI) and svg (the SVG markup, with embedded images when embedImages is enabled).


**Additional parameters for `svg` and `xmlsvg`:**



* Parameter: embedImages
  * Description: Set to false to disable embedded images in SVG output. Default is true.
* Parameter: embedCellMetadata
  * Description: Set to true to mirror each cell value's XML attributes as data-meta-{attr} on the corresponding wrapper group (the one that already carries data-cell-id). Default is false. The data-meta- prefix is reserved for user-defined metadata so a property named cell-id cannot collide with the internal data-cell-id. For the legacy rich format (extra id="cell-X" / content / type / inner shape group with unprefixed data-{attr}) load the svgdata.js plugin instead.
* Parameter: scale
  * Description: Zoom level (default: 1).
* Parameter: layerIds
  * Description: Array of visible layer IDs.
* Parameter: pageId
  * Description: ID of the page to export.
* Parameter: currentPage
  * Description: Set to true to export the currently selected page.
* Parameter: border
  * Description: Border size in pixels.
* Parameter: shadow
  * Description: Set to true to apply a shadow filter.
* Parameter: keepTheme
  * Description: Set to true to preserve the current theme.
* Parameter: theme
  * Description: Sets the export theme (dark, light, or auto).
* Parameter: background
  * Description: Background colour as a string.


**Additional parameters for `json`:**



* Parameter: allPages
  * Description: Set to false to export only the current page. Default is true.
* Parameter: includeData
  * Description: Set to true to include a copy of the diagram XML under data for lossless re-import. Default is false.
* Parameter: compressed
  * Description: When includeData is set, compress the embedded diagram XML (standard draw.io deflate). Default is false.
* Parameter: selection
  * Description: Set to true to export only the selected cells (and their descendants) of the current page. Default is false.


The `data` field of the response holds the JSON object:

```
{
  "version": "<drawio version>",
  "data": "<mxfile XML — only when includeData=true>",
  "pages": [{
    "id": "<page id>", "name": "Page-1",
    "cells": [
      {"id": "layer1", "type": "layer", "metadata": {"animation": "test"}},
      {"id": "n1", "type": "node", "parent": "layer1", "label": "A"},
      {"id": "n2", "type": "node", "parent": "layer1", "label": "Title", "html": "<b>Title</b>", "metadata": {"prop": "value"}},
      {"id": "e1", "type": "edge", "parent": "layer1", "source": "n2", "target": "n1"}
    ]
  }]
}

```


Each cell has `id` and `type` (`layer` | `group` | `node` | `edge`); non-layer cells include `parent` (id); edges add `source` / `target` (ids). `label` is the cell label — if it contains HTML markup, `label` holds the plain text and `html` the original markup. `metadata` holds the custom attributes of object/UserObject cells. References are by id, so cyclic graphs serialize without nesting. The same export is available in the UI under **File ▸ Export as ▸ JSON**.

Use the optional `xml` parameter in any export action to specify custom diagram XML to export.

#### fit[​](#fit "Direct link to fit")

Fits the diagram to the viewport.

```
{"action": "fit", "border": 16, "maxScale": 1}

```



|Parameter|Description                                       |
|---------|--------------------------------------------------|
|border   |Padding in pixels around the diagram. Default: 16.|
|maxScale |Maximum zoom scale after fitting. Default: 1.     |


#### resetEditor[​](#reseteditor "Direct link to resetEditor")

Resets the interactive UI state of the editor. If a cell label is being edited (in-place text editing), the edit is committed first via `stopEditing`. Any open menus (toolbar dropdowns and context menus) are hidden, and the current cell selection is cleared. This is useful for inline embed scenarios where clicking outside the editor container should dismiss all transient UI and deselect all diagram elements.

```
{"action": "resetEditor"}

```


#### invokeAction[​](#invokeaction "Direct link to invokeAction")

Executes a named action from the editor's action registry. This provides a generic way to trigger built-in editor actions (such as `zoomIn`, `zoomOut`, `undo`, `redo`, etc.) without requiring a dedicated message type for each one.

```
{"action": "invokeAction", "actionName": "zoomIn"}

```


The `actionName` must match a registered action name. If the action does not exist, the message is silently ignored.

#### textContent[​](#textcontent "Direct link to textContent")

Requests the text content of the current diagram.

```
{"action": "textContent"}

```


Returns `{event: 'textContent', data: '...'}`.

#### viewport[​](#viewport "Direct link to viewport")

Sets the viewport position and scale.

```
{"action": "viewport", "viewport": {...}}

```


#### snapshot[​](#snapshot "Direct link to snapshot")

Requests an SVG snapshot of the current diagram. Returns an `export` event with the SVG as a data URI. Unlike the `export` action, this uses the current export settings (background, border, theme) configured in the load action.

#### fullscreenChanged[​](#fullscreenchanged "Direct link to fullscreenChanged")

Notifies the editor that the fullscreen state has changed. Used in inline embed mode to update the editor layout.

```
{"action": "fullscreenChanged", "value": true}

```


Set `value` to `true` when entering fullscreen and `false` when exiting.

#### remoteInvoke[​](#remoteinvoke "Direct link to remoteInvoke")

The remote invocation protocol allows bidirectional function calls between the editor and the host application. This is an advanced feature used by integrations that need tighter coupling with the editor.

To signal that the host is ready to receive remote invocations:

```
{"action": "remoteInvokeReady"}

```


To call a function on the other side:

```
{"action": "remoteInvoke", "funtionName": "functionName", "functionArgs": [...]}

```


The response is returned as:

```
{"action": "remoteInvokeResponse", "resp": ..., "error": ...}

```


The editor can also send `remoteInvoke` and `remoteInvokeResponse` as events in the opposite direction.

### UI-triggered exports[​](#ui-triggered-exports "Direct link to UI-triggered exports")

By default, when a user triggers an export from the draw.io UI (e.g. _File > Export as PNG_), the file is downloaded via the browser's save dialog. When `exportProtocol` is set to `true` in the [load action](#load-action), these exports are instead routed through the JSON protocol, sending an `export` event to the host application.

The event has the same format as the response from the programmatic [export action](#export):

```
{
  "event": "export",
  "format": "png",
  "filename": "diagram.drawio.png",
  "data": "data:image/png;base64,...",
  "xml": "...",
  "bounds": {...},
  "scale": 1
}

```


Supported formats: PNG, JPG, WebP, SVG, XML, HTML, and PDF (PDF requires a configured export server).

### Diff sync[​](#diff-sync "Direct link to Diff sync")

Diff-based synchronisation provides an efficient way to exchange incremental changes between the editor and the host application, instead of transferring the full diagram XML on every change. This is useful for building collaborative editing features.

Enable diff sync by setting `diffSync` to `true` (or an options object) in the [load action](#load-action):

```
{"action": "load", "xml": "...", "autosave": 1, "diffSync": true}
{"action": "load", "xml": "...", "autosave": 1, "diffSync": {"patchOnly": true}}

```


When enabled:

*   The `load` response includes a `checksum` field.
*   [Autosave](#autosave) messages include `patch` and `checksum` fields. By default, `xml` is also included. Set `patchOnly: true` to omit the full XML.
*   The [patch](#patch), [getDiff](#getdiff), and [resetDiff](#resetdiff) actions become available.
*   The [merge](#merge) action resets the internal shadow state after a successful merge.

#### Patch format[​](#patch-format "Direct link to Patch format")

Patches use the same structure as draw.io's internal diff format:

```
{
  "u": {
    "pageId": {
      "name": "Page name",
      "cells": {
        "u": {"cellId": {"style": "...", "value": "...", "geometry": "..."}},
        "i": [{"id": "newCellId", "vertex": 1, "style": "...", "parent": "parentId"}],
        "r": ["removedCellId"]
      },
      "view": {"background": "\"#ffffff\""}
    }
  },
  "i": [{"id": "newPageId", "data": "<page XML>", "previous": "prevPageId"}],
  "r": ["removedPageId"]
}

```


Keys: `u` (update), `i` (insert), `r` (remove). Page-level patches contain cell-level patches with the same keys.

#### Resynchronisation[​](#resynchronisation "Direct link to Resynchronisation")

Each patch response and autosave message includes a `checksum`. If the host detects a mismatch between its own computed state and the editor's checksum, it should send a [resetDiff](#resetdiff) action (optionally with full XML) to resynchronise. The host can also fall back to the [merge](#merge) action for full-XML exchange at any time.

### Error handling[​](#error-handling "Direct link to Error handling")

If the editor receives an unrecognised message, it responds with `{error: 'unknownMessage', data: '...'}` where `data` is the string representation of the incoming message.

### Examples[​](#examples "Direct link to Examples")

*   [Introduction and example](https://github.com/jgraph/drawio-html5)
*   [GitHub example](https://github.com/jgraph/drawio-github)
*   [Simple embedding walkthrough](https://www.drawio.com/blog/embedding-walkthrough)
