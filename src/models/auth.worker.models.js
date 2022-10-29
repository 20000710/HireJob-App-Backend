const db = require('../config/db');

const authModelWorker = {
    register: (data) => {
        const {
            id,
            name,
            email,
            phone,
            passwordHashed,
            domicile,
            workplace,
            job_desk,
            description,
            photo,
            verifyToken
        } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO worker(id, name, email, phone, password, workplace, job_desk, description, photo, verify_token, domicile)
                VALUES('${id}', '${name}', '${email}', '${phone}', '${passwordHashed}', '${workplace}', '${job_desk}', '${description}', '${photo}', '${verifyToken}', '${domicile}')`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res)
                },
            );
        });
    },
    findby: (row, keyword) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM worker WHERE ${row} = '${keyword}'`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                },
            );
        });
    },
    verifyEmail: (token) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE worker SET verify_token=NULL, WHERE verify_token='${token}`,
                (err, res) => {
                    if (err){
                        reject(err);
                    } else {
                        resolve(res)
                    }
                },
            );
        });
    },
};

module.exports = authModelWorker;