const puppeteer = require('puppeteer');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: '404.csv',
    header: [
        { id: 'url', title: 'URL' },
        { id: 'status', title: 'Status' }
    ]
});

(async () => {
    try {
        //const urls = JSON.parse(fs.readFileSync('sitemap.json')).data
        const urls = JSON.parse(fs.readFileSync('users.json'))
        const data = [];
        console.log(urls.length)
        const browser = await puppeteer.launch({ "headless": true, defaultViewport: null });
        for (let i = 0; i < urls.length; i++) {
            let ob = {}

            // ob.url = urls[i]
            // ob.status = await statuscode(browser, urls[i])

            ob.url = urls[i].URL
            ob.status = await statuscode(browser, urls[i].URL)

            data.push(ob)
            console.log(data.length, urls.length, ob.status);
            if (data.length == urls.length) {
                await csvWriter.writeRecords(data).then(() => console.log('The CSV file was written '));
                browser.close()
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
            response = await page.goto(urls, {
                waitUntil: 'networkidle0',
                timeout: 120000,
            });

            const img = await page.$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));
            const result = img.includes("https://d10lpgp6xz60nq.cloudfront.net/images/404-broken-pencil.svg")
            if (result == true) {
                resolve("404")
            } else {
                resolve(response.status())
            }
        }
        catch { resolve("5XX") }

    })
}