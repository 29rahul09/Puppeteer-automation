const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'PageHrefs.csv',
  header: [
    { id: 'url', title: 'URL' }
  ]
});

(async () => {
  const browser = await puppeteer.launch({ "headless": true, defaultViewport: null, });
  const page = await browser.newPage();
  await page.goto('https://www.spotdraft.com/');
  const Hrefs = await page.$$eval("a", (list) => list.map((elm) => elm.href));
  console.log(Hrefs, Hrefs.length);
  let data = [];
  for (let i = 0; i < Hrefs.length; i++) {
    let ob = {}
    ob.url = Hrefs[i]
    data.push(ob)
    console.log(data.length, Hrefs.length,)
    if (data.length == Hrefs.length) {
      await csvWriter.writeRecords(data).then(() => console.log('files written successfully'));
      browser.close()
    }
  }
})();
