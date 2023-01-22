const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'PageTitle.csv',
  header: [
    { id: 'url', title: 'URL' },
    { id: 'title', title: 'TITLE' }
  ]
});

(async () => {
  try {
    const urls = JSON.parse(fs.readFileSync('users.json'));
    const data = [];
    console.log(urls.length)
    const browser = await puppeteer.launch({ "headless": false, defaultViewport: null, });
    for (let i = 0; i < urls.length; i++) {
      let ob = {}
      ob.url = urls[i].URL
      ob.title = await pagetitle(browser, urls[i].URL)
      data.push(ob)
      console.log(data.length, urls.length, ob.title)
      // console.log(Hrefs[i], ob.status, ob.title);
      if (data.length == urls.length) {
        await csvWriter.writeRecords(data).then(() => console.log('files written successfully'));
        browser.close()
      }
    };
  } catch (error) {
    console.log(error);
  };
})();

async function pagetitle(browser, Hrefs) {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      const page = await browser.newPage();
      response = await page.goto(Hrefs);
      const pageTitle = await page.title();
      if (pageTitle.length) {
        resolve(pageTitle)
      } else {
        resolve('NO TITLE')
      }
    }
    catch { resolve("5XX") }

  })
};