var http = require('http');
var fs = require('fs');
var path = require('path');
var runnerFile = require('./public/js/fetchRunners')

http.createServer(async function (request, response) {
    var filePath = '.' + request.url;
    const headers = {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    if (request.url === "/api/fetch-runners" && request.method === "GET") {
        const result = await runnerFile.getAllRunners();
        //response headers
        response.writeHead(200, headers);
        //set the response
        response.write(JSON.stringify(result));
        //end the response
        response.end();
    } else {
        if (filePath == './')
            filePath = './public/index.html';

        var extName = path.extname(filePath);
        var contentType = 'text/html';
        switch (extName) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }

        fs.exists(filePath, function (exists) {

            if (exists) {
                fs.readFile(filePath, function (error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });
    }
}).listen(3000, function () {
    console.log("SERVER STARTED PORT: 3000");
});
