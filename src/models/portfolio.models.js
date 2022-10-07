const db = require('../config/db');

const portfolioModel = {
    allData: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(*) AS total FROM portfolio`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    getAllPortfolio: (
        searchQuery,
        offsetValue,
        limitValue,
        sortQuery,
        modeQuery,
    ) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM portfolio WHERE LOWER(name) LIKE '%${searchQuery}%'
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
            db.query(`SELECT * FROM portfolio WHERE id='${id}'`, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
    insertPortfolio: (data) => {
        const {id, name, link, type, photo, description, user_id} = data
        return new Promise ((resolve, reject) =>
            db.query(`
            INSERT INTO portfolio (id, name, link, type, photo, description, user_id) 
            VALUES ('${id}', '${name}', '${link}', '${type}', '${photo}', 
            '${description}', '${user_id}')`, (error,result) => {
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        );
    },
    updatePortfolio: (data) => {
        const {id, name, link, type, photo, description, user_id} = data
        return new Promise((resolve, reject) => {
            db.query(
            `UPDATE portfolio SET name='${name}',link='${link}', 
            type='${type}', photo='${photo}', description='${description}', user_id='${user_id}' 
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
    deletePortfolio : (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM portfolio WHERE id='${id}'`,
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

module.exports = portfolioModel;