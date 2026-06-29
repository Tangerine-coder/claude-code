// Pre-warm database on server startup (before accepting requests)
// This prevents cold-start timeouts on Render free tier
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[Startup] Warming up database...');
    try {
      const { default: getDb } = await import('./lib/db');
      getDb();
      console.log('[Startup] Database ready');
    } catch (err) {
      console.error('[Startup] Database warmup failed:', err);
    }
  }
}
