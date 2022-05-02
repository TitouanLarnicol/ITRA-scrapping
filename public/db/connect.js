const sqlite3 = require("sqlite3")

const db = new sqlite3.Database('db.sqlite');

function addRace() {
    db.serialize(function () {
        db.run(
            'INSERT',
            dbCallback
        )
    });
}

function getRunnersByRace(raceName) {
    db.serialize(function () {
        db.all(
            `SELECT runners.*
            FROM races
            INNER JOIN runners_races ON runners_races.raceId = races.raceId
            INNER JOIN runners ON runners.runnerId = runners_races.runnerId
            WHERE races.raceName = '${raceName}'`,
            dbCallback
        )
    })
}

function getAllRunners() {
    db.serialize(function () {
        db.all(
            `SELECT *
            FROM runners`,
            dbCallback
        )
    })
}

function _initSQL() {
    db.serialize(function () {
        // runners
        db.run(`CREATE TABLE IF NOT EXISTS runners (
            runnerId INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            pi INTEGER,
            gender CHAR,
            nationality TEXT,
            ageGroup TEXT            
        )`,
            dbCallback);

        // races
        db.run(`CREATE TABLE IF NOT EXISTS races (
            raceId INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            raceName TEXT
        )`,
            dbCallback
        );

        // races_runners_assignees
        db.run(`CREATE TABLE IF NOT EXISTS runners_races (
            runnerId INTEGER,
            raceId INTEGER,
            PRIMARY KEY (runnerId, raceId),
            FOREIGN KEY (runnerId)
                REFERENCES runners (runnerId)
                ON DELETE CASCADE
                ON UPDATE NO ACTION,
            FOREIGN KEY (raceId)
                REFERENCES runners (raceId)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
        )`,
            dbCallback
        );
    });
    getRunnersByRace('Le Malpassant');
}

function dbCallback(err, row) {
    if (err) {
        console.log('err', err)
    } else {
        console.log('row', row)
    }
}

module.exports = {
    _initSQL
}