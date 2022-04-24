# ITRA ANALYSE
Little tool to retrieve ITRA rank from every runner registered to a particular race on the platform https://www.l-chrono.com/.

## Installation
***
How to locally install the project
```
$ git clone https://github.com/TitouanLarnicol/ITRA-scrapping.git
$ npm install
$ npm start
```

## Documentation
***
Basic node-js project without the use of any framework to keep it as simple and light as possible.  

**How it works** : app scraps every user registered to a particular race. Then for every user, a call is made to retrieve his ITRA rank. The final data is sent to the front-end to be displayed in a table.

## How to help
***
* Need optimization on the hundred/thousands calls made to https://itra.run. The scrapping is pretty quick but the corresponding calls to retrieve the itra rank are long enough to make all the requests to be done in more than a minute (~400 requests done)
* Find and use a light weight front-end framework to make the repo cleaner.
* Deploy application to a server

## FAQs
***
A list of frequently asked questions
1. **What is it for** 

As a runner, you want to know the level in the race and what should be your potential rank at the end.  

2. __Is it legal__  

Itra api seems to be open (deliberately ?) so i'm using it. 
Scraping the information from l-chrono should not be a problem since it is not sensitive or marketable data.

