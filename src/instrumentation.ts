// Pre-warm database on server startup (before accepting requests)
// This prevents cold-start timeouts on Render free tier
// IMPORTANT: skip during `next build` (NEXT_PHASE=phase-production-build),
// otherwise Render's build container tries to create/seed the SQLite DB
// which can hang the build.
export async function register() {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  if (!isBuild && process.env.NEXT_RUNTIME === 'nodejs') {
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
