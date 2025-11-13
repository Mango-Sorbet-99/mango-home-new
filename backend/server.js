try {
  const strapi = require('@strapi/strapi');
  strapi().start();
} catch (e) {
  console.error('Failed to start Strapi:', e);
  process.exit(1);
}
