const sqlite3 = require("sqlite3")

const db = new sqlite3.Database('db.sqlite');

function _initSQL() {
    db.serialize(function () {
        // CREATE TABLES MANY TO MANY
        // RUNNERS, RACES, ASSIGNEES (join)
        db.run(`CREATE TABLE IF NOT EXISTS runners (
            runner_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,            
        )`, (err, row) => {
            if (err) { console.log('err', err) }
            else { console.log('row', row) }
        });
    });
}

module.exports = {
    _initSQL
}