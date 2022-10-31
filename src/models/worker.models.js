const db = require('../config/db');

const workerModel = {
    allData: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM worker`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAllWorkers: (
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
    ) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM worker WHERE LOWER(name) LIKE '%${searchQuery}%'
          ORDER BY ${sortQuery} ${modeQuery} LIMIT ${limitValue} OFFSET ${offsetValue}`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    detail: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM worker WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    workersUpdateData: (data) => {
        const { id, name, job_desk, domicile, workplace, description, skill_id } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE worker SET name='${name}',job_desk='${job_desk}', domicile='${domicile}', 
            workplace='${workplace}', description='${description}', skill_id='${skill_id}'
            WHERE id='${id}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    workersUpdatePhotoData: (data) => {
        const { id, photo } = data;
        return new Promise((resolve, reject) => {
            db.query(`UPDATE worker SET photo='${photo}' WHERE id='${id}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
    workersDeleteData: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `
            DELETE FROM worker WHERE id='${id}'
            `,
                (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                },
            );
        });
    },
}

module.exports = workerModel;