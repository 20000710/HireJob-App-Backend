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
                `SELECT * FROM worker WHERE LOWER(worker.name) LIKE '%${searchQuery}%'
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
            db.query(
            `SELECT worker.id, worker.name, worker.email, worker.phone, worker.password, 
            worker.domicile, worker.workplace, worker.job_desk, worker.worker_description, worker.photo_worker,
            worker.verify_token, worker.skills, portfolio.portfolio_name, portfolio.link, portfolio.type,
            portfolio.photo, portfolio.porto_description, experience.position, experience.company_name,
            experience.started, experience.ended, experience.photo, experience.exp_description 
            FROM worker 
            LEFT JOIN portfolio ON worker.portfolio_id = portfolio.id
            LEFT JOIN experience ON worker.experience_id = experience.id
            WHERE worker.id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    workersUpdateData: (data) => {
        const { id, name, job_desk, domicile, workplace, description, skills, portfolio_id, experience_id } = data;
        console.log('data: ', data);
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE worker SET name='${name}',job_desk='${job_desk}', domicile='${domicile}', 
            workplace='${workplace}', worker_description='${description}', skills='${skills}', portfolio_id='${portfolio_id}', experience_id='${experience_id}'
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
            db.query(`UPDATE worker SET photo_worker='${photo}' WHERE id='${id}'`,
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