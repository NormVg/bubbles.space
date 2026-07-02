export default defineEventHandler(() => {
  return {
    status: 'ok',
    uptime: process.uptime(), // Server uptime in seconds
    memoryUsage: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(process.memoryUsage().external / 1024 / 1024) + ' MB',
    },
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString()
  }
})
