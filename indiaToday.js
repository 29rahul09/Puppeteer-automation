// NOTE- PLEASE RUN
// npm i puppeteer csv-writer 
// TO INSTALL PUPPETEER BEFORE RUN THE CODE.
const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "PageResponse.csv",
  header: [
    { id: "url", title: "URL" },
    { id: "status", title: "Status" },
  ],
});

(async () => {
  try {
    const browser = await puppeteer.launch({
      // chromium may not able to load live tv videos so you have to use chrome by adding executablePath
      // Note the executablePath option. Your path may vary. use your chrome path 
      // or you can cooment execuatablePath to continue in chromium
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://www.indiatoday.in/");
    // get all the link in side menu and navigate through all of  them
    const list = await page.$("ul.jsx-559305e56e2f7896");
    const Hrefs = await list.$$eval("a", (list) => list.map((elm) => elm.href));
    const urls = Hrefs;
    const data = [];
    for (let i = 0; i < urls.length; i++) {
      let ob = {};
      ob.url = urls[i];
      ob.status = await statuscode(browser, urls[i]);
      data.push(ob);
      console.log(data.length, urls.length, ob.status);
      if (data.length == urls.length) {
        await csvWriter
          .writeRecords(data)
          .then(() => console.log("CSV file written"));
        browser.close();
      }
    }
  } catch (error) {
    console.log(error);
  }
})();

async function statuscode(browser, urls) {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      const page = await browser.newPage();
      console.log(`loading ${urls}`);
      response = await page.goto(urls);
      // if a page display message "SORRY!The page you are looking for is no longer available."
      if ((await page.$("div.error__mesgboard")) !== null) {
        resolve("Page not Found");
      } else {
        resolve(response.status());
      }
    } catch {
      resolve("5XX");
    }
  });
}
