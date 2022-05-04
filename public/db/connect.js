import { open } from 'sqlite'
import sqlite3 from 'sqlite3';

export class DatabaseService {
    db;

    constructor() {
        (async () => {
            this.db = await open({
                filename: 'db.sqlite',
                driver: sqlite3.Database
            })
        })()
    }

    addRace(url, raceName) {
        this.db.serialize(function () {
            this.db.run(
                `INSERT INTO races(url, raceName) VALUES ('${url}', '${raceName}');`,

            )
        });
    }

    async getRunnersByRace(raceName) {
        return await this.db.all(
            `SELECT runners.*
            FROM races
            INNER JOIN runners_races ON runners_races.raceId = races.raceId
            INNER JOIN runners ON runners.runnerId = runners_races.runnerId
            WHERE races.raceName = '${raceName}'`
        )
    }

    async getRunners() {
        console.log(this.db);
        return await this.db.all(
            `SELECT * FROM runners`
        );
    }

    _initSQL() {
        this.db.serialize(function () {
            // runners
            this.db.run(`CREATE TABLE IF NOT EXISTS runners (
                runnerId INTEGER PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                pi INTEGER,
                gender CHAR,
                nationality TEXT,
                ageGroup TEXT)`);

            // races
            this.db.run(`CREATE TABLE IF NOT EXISTS races (
                raceId INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT,
                raceName TEXT)`);

            // races_runners_assignees
            this.db.run(`CREATE TABLE IF NOT EXISTS runners_races (
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
                    ON UPDATE NO ACTION)`);
        });
    }
}