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
            this._initSQL();
        })()
    }

    async addRace(url, raceName, status) {
        const existingStatus = await this.getRaceStatus(url, raceName);
        console.log('STATUS', existingStatus)
        if (!existingStatus) {
            this.db.run(
                `INSERT INTO races(url, raceName, status) VALUES ('${url}', '${raceName}', '${status}');`,
            );
        }
    }

    async addRunner(runner, url, raceName) {
        const res = await this.getRaceId(url, raceName);
        if (res.raceId) {
            const runnerId = await this.db.run(
                `INSERT INTO runners(firstName, lastName, pi, gender, nationality, ageGroup) VALUES ('${runner.firstName}', '${runner.lastName}', '${runner.pi}', '${runner.gender}', '${runner.nationality}', '${runner.ageGroup}');`,
            );
            await this.db.run(
                `INSERT INTO runners_races(runnerId, raceId) VALUES ('${runnerId.lastID}', '${res.raceId}')`,
            );
        }
    }

    async updateStatus(url, raceName, status) {
        this.db.run(
            `UPDATE races SET status = ${status} WHERE url = '${url}' AND raceName = '${raceName}'`,
        );
    }

    async getRaceStatus(url, raceName) {
        return await this.db.get(
            `SELECT status FROM races WHERE url = '${url}' AND raceName = '${raceName}'`,
        )
    }


    async getRaceId(url, raceName) {
        return await this.db.get(
            `SELECT raceId FROM races WHERE url = '${url}' AND raceName = '${raceName}'`,
        )
    }

    async getRaces() {
        return await this.db.all(
            `SELECT * FROM races;`,
        )
    }

    async getRunnersByRace(raceName, url) {
        const race = await this.getRaceStatus(url, raceName);
        console.log('EXISTING stats', race.status, url, raceName);
        if (race.status == 'COMPLETED') {
            return await this.db.all(
                `SELECT runners.*
                FROM races
                INNER JOIN runners_races ON runners_races.raceId = races.raceId
                INNER JOIN runners ON runners.runnerId = runners_races.runnerId
                WHERE races.raceName = '${raceName}'`
            )
        } else {
            return [];
        }

    }

    async getRunners() {
        return await this.db.all(
            `SELECT * FROM runners`
        );
    }

    _initSQL() {
        // races
        this.db.run(`CREATE TABLE IF NOT EXISTS races (
                raceId INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT,
                status TEXT,
                raceName TEXT)`);
        // runners
        this.db.run(`CREATE TABLE IF NOT EXISTS runners (
                runnerId INTEGER PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                pi INTEGER,
                gender CHAR,
                nationality TEXT,
                ageGroup TEXT)`);
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
    }
}

export const dbService = new DatabaseService();