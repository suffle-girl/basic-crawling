import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";

const WEBSITE_URL = "https://warehouse-theme-metal.myshopify.com";
const storeUrl = `${WEBSITE_URL}/collections/sales`;

console.log("Fetching products on sale.");

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);
const productLinks = $("a.product-item__title");

const productUrls = [];
for (const link of productLinks) {
  const relativeUrl = $(link).attr("href");
  const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);

  productUrls.push(absoluteUrl);
}

console.log(`Found ${productUrls.length} products.`);

// A new array to save each product in
const results = [];

// An optional array we can save errors to
const errors = [];

for (const url of productUrls) {
  try {
    console.log(`Fetching URL: ${url}`);

    // Download HTML of each product detail
    const productResponse = await gotScraping(url);
    const $productPage = cheerio.load(productResponse.body);

    // Use the date extraction logic from product.js
    const title = $productPage("h1").text().trim();
    const vendor = $productPage("a.product-meta__vendor").text().trim();
    const price = $productPage("span.price").contents()[2].nodeValue;
    const reviewCount = parseInt(
      $productPage("span.rating__caption").text(),
      10
    );
    const description = $productPage("div[class*='description'] div.rte");

    results.push({
      title,
      vendor,
      price,
      reviewCount,
      description,
    });
  } catch (error) {
    errors.push({ url, msg: error.message });
  }
}

console.log("RESULTS:", results);
console.log("ERRORS:", errors);
