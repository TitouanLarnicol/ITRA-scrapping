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
                `INSERT INTO races(url, raceName, status) VALUES (?, ?, ?);`,
                [url, raceName, status].map(e => this.parseQuery(e))
            );
        }
    }

    async addRunner(runner, url, raceName) {
        const res = await this.getRaceId(url, raceName);
        if (res.raceId) {
            const runnerId = await this.db.run(
                `INSERT INTO runners(firstName, lastName, pi, gender, nationality, ageGroup) VALUES (?, ?, ?, ?, ?, ?);`,
                [runner.firstName, runner.lastName, runner.pi, runner.gender, runner.nationality, runner.ageGroup].map(e => this.parseQuery(e))
            );
            await this.db.run(
                `INSERT INTO runners_races(runnerId, raceId) VALUES (?, ?)`,
                [runnerId.lastID, res.raceId].map(e => this.parseQuery(e))
            );
        }
    }

    async updateStatus(url, raceName, status) {
        this.db.run(
            `UPDATE races SET status = ? WHERE url = ? AND raceName = ?`,
            [status, url, raceName].map(e => this.parseQuery(e)).map(e => `${e}`)
        );
    }

    async getRaceStatus(url, raceName) {
        if (raceName) {
            return await this.db.get(
                `SELECT status FROM races WHERE url = '${url}' AND raceName = '${raceName}'`,
            )
        } else {
            return await this.db.get(
                `SELECT status FROM races WHERE url = '${url}'`,
            )
        }

    }


    async getRaceId(url, raceName) {
        console.log('Get race by Id', url, raceName)
        return await this.db.get(
            `SELECT raceId FROM races WHERE url = ? AND raceName = ?`,
            [url, raceName].map(e => this.parseQuery(e)).map(e => `${e}`)
        )
    }

    async getRaces() {
        return await this.db.all(
            `SELECT * FROM races;`,
        )
    }

    async getRunnersByRace(raceName, url) {
        const race = await this.getRaceStatus(url, raceName);
        if (race && race.status == 'COMPLETED') {
            console.log('Race already existing', url, raceName, race.status)
            return await this.db.all(
                `SELECT runners.*
                FROM races
                INNER JOIN runners_races ON runners_races.raceId = races.raceId
                INNER JOIN runners ON runners.runnerId = runners_races.runnerId
                WHERE races.url = ?`,
                [url].map(e => this.parseQuery(e)).map(e => `${e}`)
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

    parseQuery(str) {
        return typeof str === 'string' ? str.replace(/[&#,+()$~%'"*?<>{}]/g, '') : str;
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