import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import { analyzeLiveTrail } from './livetrail.js';
import { analyzeLiveTrack, getLiveTrackRaceName } from './livetrack.js';
import { dbService } from './db/connect.js';


// URL for data
const EXAMPLE_URL = "https://inscriptions-l-chrono.com/kvdepussy2022/registrations-list";
const ITRA_URL = "https://itra.run/api/runner/find";
const LIVE_TRAIL = 'registrations-list';
const LIVE_TRACK = 'livetrack.me';

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

    var raw = "name=" + firstName + "+" + lastName + "&start=1&count=10&echoToken=0.060678191186619435";
    console.log('request', raw)
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


export async function getRaces() {
    const res = await dbService.getRaces();
    console.log(res);
    return res;
}

export async function getAllRunners(raceName, url) {
    let existingData = [];
    switch (true) {
        case url.includes(LIVE_TRACK):
            existingData = await dbService.getRunnersByRace('', url);
            break;
        default:
            existingData = await dbService.getRunnersByRace(raceName, url);
            break;
    }
    if (existingData.length) {
        return existingData;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto(url);
    } catch (err) {
        console.log('err', err)
        return [];
    }
    let nameList = [];
    switch (true) {
        case url.includes(LIVE_TRACK):
            raceName = await getLiveTrackRaceName(page);
            nameList = await analyzeLiveTrack(page);
            break;
        case url.includes(LIVE_TRAIL):
            nameList = await analyzeLiveTrail(page, raceName);
            break;
        default:
            return nameList;
    }

    await browser.close();
    await dbService.addRace(url, raceName, 'IN PROGRESS');
    storeRunnersInDB(nameList, raceName, url);

    return [];
}

async function storeRunnersInDB(namesList, raceName, url) {
    for (let i = 0; i < namesList.length; i++) {
        const [lastName, firstName] = namesList[i].toString().split(' ');
        const runnerToStore = await getItraFromRunner(lastName, firstName);
        if (runnerToStore.results.length) {
            await dbService.addRunner(runnerToStore.results[0], url, raceName);
        }
    }
    await dbService.updateStatus(url, raceName, 'COMPLETED')
}

async function retrieveItraFromRunner(namesList) {
    const resolvedResults = await Promise.allSettled(
        namesList.map(runner => {
            const [lastName, firstName] = runner.toString().split(' ');
            return getItraFromRunner(lastName, firstName);
        })
    );
    return resolvedResults.filter(response => response.status == 'fulfilled').map(res => res.value);
}

function mapData(data) {
    const test = data.reduce((acc, x) => acc.concat(x.results.length > 1 ? [x.results[0]] : x.results), []).filter(runner => runner.pi > 0);
    return test
}