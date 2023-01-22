// require csvtojson module
const puppeteer = require("puppeteer");
const CSVToJSON = require('csvtojson');
const fs = require('fs');
//convert .csv file to JSON array
(async () => {
    try {
        const users = await CSVToJSON().fromFile('PageHrefs.csv');
        console.log(users)
    // write JSON aaray into .json file
        fs.writeFile('users.json', JSON.stringify(users, null,), (err) => {
            console.log("JSON Array-Object is saved.");
        });
    } catch (err) {
        console.log(err);
    }

})();
// READ data from .json file
(async () => {
    try {
        const urls = JSON.parse(fs.readFileSync('users.json'))
        console.log(urls.length);
        const browser = await puppeteer.launch({ "headless": true, defaultViewport: null, });
        const page = await browser.newPage();
        for (let i = 0; i < urls.length; i++) {
            const links = urls[i].URL
            //console.log(links);
            console.log(`loading page: ${links}`);

            await page.goto(links, {
                waitUntil: 'networkidle0',
                timeout: 12000,
            });
        };
        await browser.close()

    } catch (err) {
        console.log(err);
    }

})()
