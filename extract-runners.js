const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

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

    return fetch("https://itra.run/api/runner/find", requestOptions)
        .then(response => response.json())
        .catch(error => console.log('error', error));
}


// URL for data
const URL = "https://inscriptions-l-chrono.com/trailnivoletrevard2022/registrations-list";
const ITRA_URL = "https://itra.run/api/runner/find";

const fetchAndAnalyzeRunners = (page) => {
    const runners = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td:nth-child(-n + 2)'))
        return tds.map(p => p.innerText).reduce((acc, val, idx) =>
            idx % 2 !== 0
                ? (acc ? `${acc} ${val}` : `${val}`)
                : (acc ? `${acc},${val}` : `${val}`), '').split(',')
    });

    for (let runner of runners) {
        try {
            const [lastName, firstName] = runner.split(' ');
            const data = await getItraFromRunner(lastName, firstName);
            if (data.results.length > 0) {
                const runnerData = data.results[0];
                console.log("Runner " + runnerData.firstName + " " + runnerData.lastName + " with ITRA " + runnerData.pi)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}

// invoking the main function
function _init() {
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(URL);

        fetchAndAnalyzeRunners(page);

        await browser.close();
    })();
}

_init();
