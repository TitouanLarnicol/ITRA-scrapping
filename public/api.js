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
    data.forEach(runnerData => {
        if (runnerData.results.length > 0) {
            const runner = runnerData.results[0];
            const runnerElement = document.createElement('p');
            runnerElement.innerText = `Runner ${runner.lastName} ${runner.firstName} with ITRA ${runner.pi}`;
            resultsContainer.append(runnerElement);
        }
    });
}