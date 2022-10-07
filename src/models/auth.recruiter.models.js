const db = require('../config/db');

const authModelRecruiter = {
    register: (data) => {
        const {
            id,
            name,
            company,
            position,
            phone,
            email,
            passwordHashed,
            photo,
            verifyToken
        } = data;
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO recruiter(id, name, company, position, phone, email, password, photo, verify_token)
                VALUES('${id}', '${name}', '${company}', '${position}', '${phone}', '${email}', '${passwordHashed}', '${photo}', '${verifyToken}')`,
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
                `SELECT * FROM recruiter WHERE ${row} = '${keyword}'`,
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
                `UPDATE recruiter SET verify_token=NULL, WHERE verify_token='${token}`,
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

module.exports = authModelRecruiter;