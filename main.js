// At any point, we can extract URLs, data, or both. ´
// Crawling can be separate from data extraction, but it's not a requirement and, in most projects,
// it's actually easier and faster to do both at the same time.

//To summarize, it goes like this:

// Visit the start URL.
// Extract new URLs (and data) and save them.
// Visit one of the new-found URLs and save data and/or more URLs from them.
// Repeat 2 and 3 until you have everything you need.

import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";

// Split the base URL from the category
const WEBSITE_URL = "https://warehouse-theme-metal.myshopify.com";
const storeUrl = `${WEBSITE_URL}/collections/sales`;

const response = await gotScraping(storeUrl);
const html = response.body;

const $ = cheerio.load(html);

// Find all the links on the website
const productLinks = $("a.product-item__title");

for (const link of productLinks) {
  const relativeUrl = $(link).attr("href");

  // Resolve relative URLs
  const absoluteUrl = new URL(relativeUrl, WEBSITE_URL);
  const url = absoluteUrl.href;

  console.log(url);
}
