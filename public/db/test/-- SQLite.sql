-- SQLite
INSERT INTO races(url, raceName) VALUES ('https://test.com', 'Le Malpassant');

SELECT * FROM races;
-- Delete FROm races where raceId = 2

INSERT INTO runners VALUES (21500, 'Titouan', 'Larnicol', 724, 'H', 'FR', '23-34M');
INSERT INTO runners VALUES (21105, 'Veronika', 'Komprecht', 550, 'F', 'DE', '23-34M');

SELECT * FROM runners;

INSERT INTO runners_races VALUES (21500, 1);
INSERT INTO runners_races VALUES (21105, 1);

SELECT * FROM runners_races;

DELETE FROM runners_races WHERE runnerId = 2

SELECT raceId FROM races WHERE raceName = 'Le Malpassant';

SELECT runnerId FROM runners_races WHERE raceId = 1;

SELECT runners.*
FROM races
INNER JOIN runners_races ON runners_races.raceId = races.raceId
INNER JOIN runners ON runners.runnerId = runners_races.runnerId
WHERE races.raceName = 'Le Malpassant'