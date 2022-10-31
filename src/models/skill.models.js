const db = require('../config/db');

const skillModel = {
    allData: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM skills`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAllSkills: (
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
    ) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM skills WHERE id LIKE '%${searchQuery}%'
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
            db.query(`SELECT * FROM skills WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    insertSkills: (data) => {
        const { id, skills, user_id } = data
        return new Promise((resolve, reject) =>
                db.query(`
            INSERT INTO skills (id, skills, user_id)
            VALUES ('${id}', '${skills}', '${user_id}')`, (error, result) => {
                    if (!error) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                })
            );
    },
    updateSkills: (data) => {
        const { id, skills, user_id } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE skills SET skills='${skills}', user_id='${user_id}' WHERE id='${id}'`,
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
    deleteSkills: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM skills WHERE id='${id}'`,
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

module.exports = skillModel;