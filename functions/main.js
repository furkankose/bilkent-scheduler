import { join } from "path";
import { scrape as scrapeApplicationData } from "./scraper";

(async () => {
  await scrapeApplicationData(join(__dirname, "../public/data"));
})();
