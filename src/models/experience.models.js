const db = require('../config/db');

const experienceModel = {
    allData: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM experience`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAllExperience: (
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
    ) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM experience WHERE LOWER(company_name) LIKE '%${searchQuery}%'
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
            db.query(`SELECT * FROM experience WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    insertExperience: (data) => {
        const {id, position, company_name, started, ended, photo, description} = data
        return new Promise ((resolve, reject) =>
            db.query(`
                INSERT INTO experience (id, position, company_name, started, ended, photo, description) 
                VALUES ('${id}', '${position}', '${company_name}', '${started}', '${ended}', '${photo}', '${description}' )`, (error,result) => {
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        );
    },
    updateExperience: (data) => {
        const { id, position, company_name, started, ended, photo, description } = data;
        return new Promise((resolve, reject) => {
            db.query(
            `UPDATE experience SET position='${position}',company_name='${company_name}', 
            started='${started}', ended='${ended}', photo=${photo}, description='${description}'
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
    deleteExperience : (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM experience WHERE id='${id}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }else {
                        resolve(res);
                    }
                },
            );
        });
    }
}

module.exports = experienceModel;