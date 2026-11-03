process.env.ASTRO_TELEMETRY_DISABLED='1';
await import('./prepare-assets.mjs');
const {build}=await import('astro');
await build({});
