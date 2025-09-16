// Strapi frontend configuration for Blog 2
// Fill in your Strapi base URL and optional public API token (only needed if you restrict public permissions)
// Example baseUrl for Strapi Cloud: https://your-project-name.region.strapiapp.com

window.STRAPI_CONFIG = {
  baseUrl: "https://legendary-badge-04704472f8.strapiapp.com/admin", // switch to your Strapi Cloud URL for production
  apiToken: "33325110d15e19682b02c770b00ba0b4ca6c850c912c13698db01e16049a2865b5afe9d2472e2e15b7690b45ab60090e66c9582e50580c130cfb4397bc804eafaf863b49e549785fa1c66d307279c420e97908fe1bc9458840e06ee287eefd1f211889502b2ba3055e2431c51891dc2c4f9bfbd7ae5acb4215a98adb054ca269", // optional: create an API Token in Strapi > Settings > API Tokens (type: Read-only)
  pageSize: 6, // items per page on listing
};
