process.env.ASTRO_TELEMETRY_DISABLED='1';
const {build}=await import('astro');
await build({});
