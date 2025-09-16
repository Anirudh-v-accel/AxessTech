// Strapi frontend configuration for Blog 2
// Fill in your Strapi base URL and optional public API token (only needed if you restrict public permissions)
// Example baseUrl for Strapi Cloud: https://your-project-name.region.strapiapp.com

window.STRAPI_CONFIG = {
  baseUrl: "http://localhost:1337", // switch to your Strapi Cloud URL for production
  apiToken: "", // optional: create an API Token in Strapi > Settings > API Tokens (type: Read-only)
  pageSize: 6, // items per page on listing
};
