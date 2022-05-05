import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import { DatabaseService } from './db/connect.js';

const dbService = new DatabaseService();

// URL for data
const EXAMPLE_URL = "https://inscriptions-l-chrono.com/trailnivoletrevard2022/registrations-list";
const ITRA_URL = "https://itra.run/api/runner/find";

/**
 * Make API call to itra.com to retrieve runner information
 * @param {*} lastName 
 * @param {*} firstName 
 * @returns 
 */
const getItraFromRunner = async (lastName, firstName) => {
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
    const runner = await fetch(ITRA_URL, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject()
            }
        })
        .catch(e => Promise.reject(e));
    return runner;
}

/**
 * Iterate over every td element in the table to retrieve last and first name.
 * @param {*} page 
 * @returns 
 */
async function retrieveNames(page) {
    const runners = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td:nth-child(-n + 2)'))
        return tds.map(p => p.innerText).reduce((acc, val, idx) =>
            idx % 2 !== 0
                ? (acc ? `${acc} ${val}` : `${val}`)
                : (acc ? `${acc},${val}` : `${val}`), '').split(',')
    });

    return runners;
}

export default async function getAllRunners(raceName, url) {
    console.log(raceName, url)
    const existingData = await dbService.getRunnersByRace(raceName);
    if (existingData.length) {
        return existingData;
    }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    page.on('console', async (msg) => {
        const msgArgs = msg.args();
        for (let i = 0; i < msgArgs.length; ++i) {
            console.log(await msgArgs[i].jsonValue());
        }
    });

    let optionValue = await page.$$eval('option', (options, raceName) => {
        return options.find(o => o.innerText === raceName)?.value;
    }, raceName)
    await page.select('select#competitions', optionValue);
    let optionItemPerPage = await page.$$eval('option', options => options.find(o => o.innerText === '100')?.value)
    await page.select('select#items_per_page', optionItemPerPage);

    var namesList = []; // variable to hold collection of all runners
    let lastPage;
    while (!lastPage) {
        // wait 1 sec for page load
        await page.waitFor(2000);

        const results = await retrieveNames(page);
        namesList = namesList.concat(...results);

        lastPage = await page.evaluate(() => {
            return document.querySelector('li.next-page.disabled');
        });
        if (!lastPage) {
            await page.click('li.next-page > a');
        }
    }
    await browser.close();
    const results = await retrieveItraFromRunner(namesList);

    return mapData(results);
}

async function retrieveItraFromRunner(namesList) {
    const resolvedResults = await Promise.allSettled(
        namesList.map(runner => {
            const [lastName, firstName] = runner.split(' ');
            return getItraFromRunner(lastName, firstName);
        })
    );
    return resolvedResults.filter(response => response.status == 'fulfilled').map(res => res.value);
}

function mapData(data) {
    const test = data.reduce((acc, x) => acc.concat(x.results.length > 1 ? [x.results[0]] : x.results), []).filter(runner => runner.pi > 0);
    return test
}