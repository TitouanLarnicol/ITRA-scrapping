export function addRace(db, url, raceName) {
    db.serialize(function () {
        db.run(
            `INSERT INTO races(url, raceName) VALUES ('${url}', '${raceName}');`,
            dbCallback
        )
    });
}

export function getRunnersByRace(db, raceName) {
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

export function getAllRunners(db) {
    db.serialize(function () {
        db.all(
            `SELECT *
            FROM runners`,
            dbCallback
        )
    })
}

export function _initSQL(db) {
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
}

export function dbCallback(err, row) {
    if (err) {
        console.log('err', err)
    } else {
        console.log('row', row)
    }
}