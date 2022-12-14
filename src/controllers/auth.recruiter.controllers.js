const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const jwtToken = require('../helpers/generateJWTToken');
const { success, failed, successLogin } = require('../helpers/response');
const authModelRecruiter = require('../models/auth.recruiter.models');

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, company, position, phone, password } = req.body
            const emailCheck = await authModelRecruiter.findby('email', email)
            if (emailCheck.rowCount == 0) {
                const id = uuidv4();
                const verifyToken = crypto.randomBytes(16).toString('hex');
                const passwordHashed = await bcrypt.hash(password, 10);
                const photo = '';

                const data = {
                    id,
                    name,
                    email,
                    company,
                    position,
                    phone,
                    passwordHashed,
                    photo,
                    verifyToken
                };
                await authModelRecruiter.register(data);
                success(res, {
                    code: 200,
                    status: 'success',
                    message: 'register success',
                    data: data
                });
            } else {
                const err = {
                    message: 'email is already registered'
                };
                failed(res, {
                    code: 400,
                    status: 'error',
                    message: err.message,
                    error: [],
                });
                return;
            }
        } catch (error) {
            failed(res, {
                code: 500,
                status: 'error',
                message: error,
                error: [],
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const isRegistered = await authModelRecruiter.findby('email', email)
            // console.log('req: ', req.body)
            if (isRegistered.rowCount > 0) {
                bcrypt
                    .compare(password, isRegistered.rows[0].password)
                    .then(async (match) => {
                        if (match) {
                            const token = await jwtToken({
                                id: isRegistered.rows[0].id,
                            });
                            successLogin(res, {
                                code: 200,
                                status: 'success',
                                message: 'login success',
                                name: isRegistered.rows[0].name,
                                token: token,
                            });
                        } else {
                            success(res, {
                                code: 500,
                                status: 'error',
                                message: 'wrong email or password',
                                error: [],
                            });
                        }
                    });

            } else {
                failed(res, {
                    code: 404,
                    status: 'error',
                    message: 'email not registered',
                    error: [],
                });
            }
        } catch (error) {
            failed(res, {
                code: 500,
                status: 'error',
                message: error.message,
                error: [],
            });
        }
    },

}

module.exports = authController;