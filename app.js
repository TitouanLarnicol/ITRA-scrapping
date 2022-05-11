import express from "express";
import { getAllRunners, getRaces } from './public/fetchRunners.js';
import cors from 'cors';

const PORT = process.env.port || 3000;
const app = express();

const allowedOrigins = ['http://localhost:8080'];

const options = {
    origin: allowedOrigins
};

const headers = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
};

app.use(cors(options))
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome on Itra Comparator API'));

// GET ALL RUNNERS
app.post('/api/fetch-runners', async (req, res) => {
    const result = await getAllRunners(req.body.raceName, req.body.url);
    //response headers
    res.writeHead(200, headers);
    //set the response
    res.write(JSON.stringify(result));
    //end the response
    res.end();
});

// GET ONE RACE
app.get('/api/fetch-race/:raceUrl/:raceName', async (req, res) => {
    const result = await getAllRunners(req.params.raceName, req.params.raceUrl);
    //response headers
    res.writeHead(200, headers);
    //set the response
    res.write(JSON.stringify(result));
    //end the response
    res.end();
});
// GET RACES
app.get('/api/fetch-races', async (req, res) => {
    const result = await getRaces();
    //response headers
    res.writeHead(200, headers);
    //set the response
    res.write(JSON.stringify(result));
    //end the response
    res.end();
});

app.listen(PORT, () => console.log("SERVER STARTED PORT: ", PORT))