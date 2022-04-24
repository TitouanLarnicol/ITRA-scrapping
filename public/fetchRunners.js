const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

// URL for data
const URL = "https://inscriptions-l-chrono.com/trailnivoletrevard2022/registrations-list";
const ITRA_URL = "https://itra.run/api/runner/find";

const getItraFromRunner = (lastName, firstName) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36");

    var raw = "name=" + firstName + "+" + lastName + "&nationality=&start=1&count=10&echoToken=0.060678191186619435";
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(ITRA_URL, requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}

async function fetchAndAnalyzeRunners(page) {
    const runners = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td:nth-child(-n + 2)'))
        return tds.map(p => p.innerText).reduce((acc, val, idx) =>
            idx % 2 !== 0
                ? (acc ? `${acc} ${val}` : `${val}`)
                : (acc ? `${acc},${val}` : `${val}`), '').split(',')
    });

    const results = await Promise.all(runners.map(runner => {
        const [lastName, firstName] = runner.split(' ');
        return getItraFromRunner(lastName, firstName)
    }));
    return results;
}

// invoking the main function
async function getAllRunners() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);

    let optionValue = await page.$$eval('option', options => options.find(o => o.innerText === "Le Malpassant")?.value)
    await page.select('select#competitions', optionValue);
    let optionItemPerPage = await page.$$eval('option', options => options.find(o => o.innerText === '100')?.value)
    await page.select('select#items_per_page', optionItemPerPage);

    var results = []; // variable to hold collection of all book titles and prices
    let lastPage;
    // defined simple loop to iterate over number of catalogue pages
    while (!lastPage) {
        // wait 1 sec for page load
        await page.waitFor(2000);

        const tmp = await fetchAndAnalyzeRunners(page);
        results = results.concat(...tmp);

        lastPage = await page.evaluate(() => {
            return document.querySelector('li.next-page.disabled');
        });
        if (!lastPage) {
            await page.click('li.next-page > a');
        }

    }
    await browser.close();
    return results;
}

module.exports = {
    getAllRunners
}