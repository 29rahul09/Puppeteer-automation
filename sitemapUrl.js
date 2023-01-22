const puppeteer = require("puppeteer");
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'sitemapUrl.csv',
    header: [
        { id: 'url', title: 'URL' },
        { id: 'status', title: 'Status' }
    ]
});
(async () => {
    const browser = await puppeteer.launch({ "headless": false });
    const page = await browser.newPage();
    await page.goto('.xml file', {
        waitUntil: 'networkidle0',
        timeout: 120000,
    });
    const urls = await page.$$eval('loc', elements => elements.map(item => item.textContent));
    console.log(urls);
    console.log(urls.length)
    const data = [];
    for (let i = 0; i < urls.length; i++) {
        let ob = {}
        let response;
        response = await page.goto(urls[i]);
        console.log(`loading page: ${urls[i]}`);
        ob.url = urls[i]
        ob.status = await response.status()
        data.push(ob)
        if (data.length == urls.length) {
            await csvWriter.writeRecords(data).then(() => console.log('The CSV file was written successfully'));
            browser.close()
        }

    }
    // await csvWriter.writeRecords(data)
    // await browser.close();
})();