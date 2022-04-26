var apiUrl = 'http://localhost:3000/api/fetch-runners';

function fetchRunners() {
    const loader = document.getElementById("loading");
    const mainContainer = document.getElementById("main");
    if (loader.style.display === 'flex') {
        return;
    }
    loader.style.display = "flex";
    mainContainer.style.display = "none";

    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        loader.style.display = "none";
        mainContainer.style.display = "grid";
        showResults(data);
    }).catch(err => {
        console.log('error :', err);
        loader.style.display = "none";
        mainContainer.style.display = "grid";
    });
};

function showResults(data) {
    document.getElementById("loading").style.display = "none";
    const resultsContainer = document.getElementById("results");
    const finalResults = data.reduce((acc, x) => acc.concat(x.results.length > 1 ? [x.results[0]] : x.results), []).filter(runner => runner.pi > 0);
    finalResults
        .sort((a, b) => {
            if (a.pi > b.pi) return -1;
            if (a.pi < b.pi) return 1;
            return 0;
        })
        .forEach((runner, index) => {
            createRunnerElement(resultsContainer, runner, index)
        });
    setChart(finalResults);
}

function createRunnerElement(container, runner, index) {
    const indexSpan = document.createElement('span');
    const runnerElement = document.createElement('span');
    const runnerContainer = document.createElement('div');
    if (runner.gender === 'H') {
        indexSpan.style.color = '#b1dae7';
    } else {
        indexSpan.style.color = '#ebb9cc';
    }
    indexSpan.innerText = `${index + 1} - `
    runnerElement.innerText = `${runner.firstName} ${runner.lastName} with ITRA ${runner.pi} - ${runner.ageGroup}`;

    runnerContainer.style.marginLeft = 50;
    runnerContainer.append(indexSpan, runnerElement);

    container.append(runnerContainer);
}

function setChart(runners) {
    const ctx = document.getElementById('myChart').getContext('2d');
    console.log(runners)
    const test = runners.reduce((acc, runner) => {
        switch (true) {
            case runner.pi >= 800:
                acc[4] = acc[4] + 1
                break;
            case runner.pi >= 700:
                acc[3] = acc[3] + 1
                break;
            case runner.pi >= 600:
                acc[2] = acc[2] + 1
                break;
            case runner.pi >= 500:
                acc[1] = acc[1] + 1
                break;
            case runner.pi < 500:
                acc[0] = acc[0] + 1
                break;
        }
        return acc
    }, [0, 0, 0, 0, 0])
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['400', '500', '600', '700', '800'],
            datasets: [{
                label: '# of runners',
                data: test,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true
        }
    });
}