export async function analyzeLiveTrail(page) {
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
    return namesList;
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