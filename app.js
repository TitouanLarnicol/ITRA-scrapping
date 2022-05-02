const express = require('express')
var runnerFile = require('./public/fetchRunners');
const db = require('./public/db/connect');

const PORT = process.env.port || 3000;
const app = express();

app.get('/', (req, res) => res.send('Welcome on Itra Comparator API'));

app.get('/api/fetch-runners', async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    const result = await runnerFile.getAllRunners();
    //response headers
    res.writeHead(200, headers);
    //set the response
    res.write(JSON.stringify(result));
    //end the response
    res.end();
});

app.listen(PORT, () => console.log("SERVER STARTED PORT: ", PORT))

db._initSQL();
