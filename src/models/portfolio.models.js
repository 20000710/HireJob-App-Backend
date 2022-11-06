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
                `SELECT * FROM portfolio WHERE LOWER(portfolio_name) LIKE '%${searchQuery}%'
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
        const {id, name, link, type, photo, description} = data
        return new Promise ((resolve, reject) =>
            db.query(`
            INSERT INTO portfolio (id, portfolio_name, link, type, photo_porto, porto_description) 
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
        const {id, name, link, type, photo, porto_description} = data
        return new Promise((resolve, reject) => {
            db.query(
            `UPDATE portfolio SET portfolio_name='${name}',link='${link}', 
            type='${type}', photo_porto='${photo}', porto_description='${porto_description}' 
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