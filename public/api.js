function fetchRunners() {
    var apiUrl = 'http://localhost:3000/api/fetch-runners';
    document.getElementById("loading").style.display = "none"
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        showResults(data);
    }).catch(err => {
        console.log('error :', err);
        // Do something for an error here
    });
};

function showResults(data) {
    document.getElementById("loading").style.display = "block"
    const resultsContainer = document.getElementById("results");
    data
        .reduce((acc, x) => acc.concat(x.results.length > 1 ? [x.results[0]] : x.results), [])
        .filter(runner => runner.pi > 0)
        .sort((a, b) => {
            if (a.pi > b.pi) return -1;
            if (a.pi < b.pi) return 1;
            return 0;
        })
        .forEach(runner => {
            const runnerElement = document.createElement('p');
            runnerElement.innerText = `Runner ${runner.lastName} ${runner.firstName} with ITRA ${runner.pi}`;
            resultsContainer.append(runnerElement);
        });
}