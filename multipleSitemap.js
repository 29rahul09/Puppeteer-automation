const puppeteer = require('puppeteer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
(async () => {
    const sitemaps = [
        'first.xml',
        'second.xml',
        'third.xml',
        
    ];
    const browser = await puppeteer.launch({ "headless": true, defaultViewport: null, });
    const page = await browser.newPage();
    let Data = []
    console.log(sitemaps)
    for (let j = 0; j < sitemaps.length; j++) {
        let obj = {}
        let response;
        response = await page.goto(sitemaps[j], {
            waitUntil: 'networkidle0',
            timeout: 120000,
        });
        obj.url = sitemaps[j]
        Data.push(obj)
        console.log(Data.length, sitemaps.length)
        console.log(`loading page: ${sitemaps[j]}`);

        const urls = await page.$$eval('loc', elements => elements.map(item => item.textContent));
        let data = [];
        console.log(urls)
        for (let i = 0; i < urls.length; i++) {
            let ob = {}
            let response;
            response = await page.goto(urls[i]);
            ob.url = urls[i]
            ob.status = await response.status()
            data.push(ob)
            //  console.log(`loading page: ${urls[i]}`);
            console.log(data.length, urls.length, urls[i], response.status());
            if (data.length == urls.length) {
                const csvWriter = createCsvWriter({
                    path: `${j}.csv`,
                    header: [
                        { id: 'url', title: 'URL' },
                        { id: 'status', title: 'Status' }
                    ]
                });
                await csvWriter.writeRecords(data).then(() => console.log('The CSV file was written successfully'));
            }
        }
        if (Data.length == sitemaps.length) {
            console.log('ALL CSV files written successfully');
            browser.close()
        }
    }
})();
