export async function analyzeLiveTrack(page) {
    // Live track need a scroll down to load the results... :(
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
    await page.waitForTimeout(3000)
    const runners = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td:first-child'))
        return tds.map(p => p.innerText)
    });
    return runners;
}