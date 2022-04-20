const cheerio = require("cheerio");
const fetch = require('node-fetch');

const getRawData = (url) => {
    return fetch(url).then((response) => response.text())
        .then((data) => data)
}
const getItraFromRunner = (lastName, firstName) => {
    var myHeaders = new fetch.Headers();
    myHeaders.append("authority", "itra.run");
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-US,en;q=0.9,fr;q=0.8,de;q=0.7");
    myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("cookie", "_ga=GA1.2.5134820.1641820803; Lang=en; .AspNetCore.Antiforgery.KYulInBaheU=CfDJ8HSgzzEiIcZGrJCFHvB5J-MPH7dAq8AS1JOeD3088f-BlpyJ1swICVEyln20bSIip5alGPmZ_rUL6j4GIBhllgCVFe0lH693ktMimiB9Y_xCXTqIipoxzDQNkc8eevTBhTAJ-6ax_HEPwNbLUJs-05U; _gid=GA1.2.1319637453.1650464574; .AspNetCore.Identity.Application=CfDJ8HSgzzEiIcZGrJCFHvB5J-PDVEzx3TP0ikzieQeSp-qa8MnxZ6N5LkZgtsA1KdCb8L0kZy791Voxk1Pgnvd2RVPKVpfX31Jizo9hd-6UvfeTmzaq0q_JmFLUAA4X-h5u7H4pMAWETUsvcIMNpnf5RLwNXmsRMIjB4ETVgG4hmDsbQifkhMi6w4_4nMa0PtNglL7wSF_AIBqsVJ9oChRpdrKkyGW4sgjBwwY1BNSHaztoGtCOBTYQKsqnzyvjOTimf0_-kyZwBIxgod31bpdeq0JdHw8DAtetkhQhZHI_Lb0xjEUpb_sguZw1jvrMo-Uf0sO41CNH7X6x46hg2FDtSbZifX1EXOLkiBKA6cEORM239JhKgTbCrJLSagFXUUwQtdSupsVNPKLzIIfo_57jqK_s1wa0DXs-M5rLPpDJ8PrRiTUcdwD_b2_H0egG6UYXRbolBFlhqQIrlVtQU22vB66YUmEz0qmpv1RoW37GH6ntNDtuEAlsYp9B7sYhZAMPuFhtRoDVIElDXiZUR0KH8QZxr0o2eKPbYhwXkO7udhlh6MHYhSf8rMur_lSWtaHXD2iRM6B4S-cZYz_lqdi0S0NYDPYhcGL5U0h-loFq2e62aSX0ZxqDuDXQf6Uv1rTxBcmFevPXaqlpGSQO1nn930DfJh4KtJHfDBdHVvLLsvF22DlWDQfte4OELWo9O8Py2K8lYQWdudrGNTaI9INOroWPE_gSn2sKSFHjQXVEm-e70YdP1DY2pp7N54Y4L2jsfyyR3gbFzi2lVBH3UWUzUI8NmPuAFq9GhRhTt8ROtxs6; AWSALB=wZIz//RBZoSCFssq3YF8H9nQDmIUVT4EoM0DxNmCCZYAVlKYN764jSuH3tkqXazU66y3xs96CLdb+RZHBLYteRMXSN6RJg8qvmZ+G2k/30N7e0J7ZsOR2szgBGR1; AWSALBCORS=wZIz//RBZoSCFssq3YF8H9nQDmIUVT4EoM0DxNmCCZYAVlKYN764jSuH3tkqXazU66y3xs96CLdb+RZHBLYteRMXSN6RJg8qvmZ+G2k/30N7e0J7ZsOR2szgBGR1; .AspNetCore.Identity.Application=CfDJ8HSgzzEiIcZGrJCFHvB5J-NxQKA8TfxR9D-G2QdtrqNtVO8YW3CzKtlx38r8fWjDWeuPZ3Jt3ojMNRkTM0kIptO9LMvniU1Fm1NURj-nESMdXTYpaNWHZfiavRezZoEXupMZEg2zQPSJTvs0pQa1pJgXMr6usDkLgZUNdvWpajjbBe5axYk2P7pEeAch6EMqqlpdpJKHJ-EAbrZj_mAvEiAeldiqfMVFBnRYqMUdr_72qa2AkZLqZGNk7NfY0_gVrN_tgTOP2jrfK0IKF-_qo_BhC4etLhSUsU0Tb5v9hgF5h6fRmsAXtysaxJvR5rRzgt7goK4-xpsSeONOX_DCkFvAZYFNGSRiEQJvlVvRtQEusXkTWYxG4W3hCfpldQZQiQQ0xHNTUv1dAp2DMkSX6t0mTk3ORwMSERqau8LaEswwR4fjgFaV1pCXZ5Kw2Vi1JW6GRUu_9yqlEBSmIsxPc17LSWNCGOn23AiHkyev9bx30MNYWwVLeukobhEwjyKdt9Pda2EG5JY3e6yIny1oS1g2-LVO8S-pKQEPVHZaU00sYgAKoUXaudmT-ZrAwLda2pXPTAVRyLwc-6wDcRLJVIstZ_LXH7wntZV7_bsP4nikXE1AfU3FHE4cH4Bhs0WPklEw1MTpwYv6Eo0fXpn8GGPr_MFmEXdBXMj7UiusVMsWK5l4RKb5jR5GwYuQMSTxdfX9HL664z2EidWLmWKXPLG4dfHGfcv4nmNjpL8ss_dBdmyqIKxh88mMhujHmNABd6hvxtBjGrZsecaLiTwkJDI; AWSALB=tGeTEvtFh3gxp8znRJmy23VcbOpTKYlZapXErv4Ivf2Sf8fThRJWIZvN0Kqm0L7hgpVz4yB8a8ps7XX0wk3CZtOFOAaqBQy6PiCRkoBe4cLgvIta3URsn78ReewP; AWSALBCORS=tGeTEvtFh3gxp8znRJmy23VcbOpTKYlZapXErv4Ivf2Sf8fThRJWIZvN0Kqm0L7hgpVz4yB8a8ps7XX0wk3CZtOFOAaqBQy6PiCRkoBe4cLgvIta3URsn78ReewP");
    myHeaders.append("origin", "https://itra.run");
    myHeaders.append("referer", "https://itra.run/Runners/FindARunner");
    myHeaders.append("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36");
    myHeaders.append("x-requested-with", "XMLHttpRequest");

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

// start of the program
const getRunners = async () => {
    const data = await getRawData(URL);
    const $ = cheerio.load(data)
    let runners = [];
    $("tr").each(function (i, elem) {
        const $td = $(this).find('td');
        const lastName = $td.eq(0).text().toLocaleLowerCase();
        const firstName = $td.eq(1).text().toLocaleLowerCase();
        runners.push({ lastName, firstName })
    })
    for (let runner of runners) {
        try {
            const data = await getItraFromRunner(runner.lastName, runner.firstName);
            if (data.results.length > 0) {
                const runnerData = data.results[0];
                console.log("Runner " + runnerData.firstName + " " + runnerData.lastName + " with ITRA " + runnerData.pi)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

};

// invoking the main function
getRunners();
