import express from "express";
import getAllRunners from './public/fetchRunners.js';
import cors from 'cors';

const PORT = process.env.port || 3000;
const app = express();

const allowedOrigins = ['http://localhost:8080'];

const options = {
    origin: allowedOrigins
};

app.use(cors(options))
app.use(express.json());

app.get('/', (req, res) => res.send('Welcome on Itra Comparator API'));

/**
 * Body expected: { raceName: string, url: string }
 */
app.post('/api/fetch-runners', async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    const result = await getAllRunners(req.body.raceName, req.body.url);
    //response headers
    res.writeHead(200, headers);
    //set the response
    res.write(JSON.stringify(result));
    //end the response
    res.end();
});

app.listen(PORT, () => console.log("SERVER STARTED PORT: ", PORT))