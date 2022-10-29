const { success, failed } = require('../helpers/response');
const skillModel = require('../models/skill.models');
const { v4: uuidv4 } = require('uuid');

const skillController = {
    getAllSkills: async (req, res) => {
        try {
            const { search, page, limit, sort, mode } = req.query;
            const searchQuery = search || '';
            const pageValue = page ? Number(page) : 1;
            const limitValue = limit ? Number(limit) : 5;
            const offsetValue = (pageValue - 1) * limitValue;
            const sortQuery = sort ? sort : 'skills';
            const modeQuery = mode ? mode : 'ASC';
            if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
                const allData = await skillModel.allData()
                const totalData = allData.rows[0].total;
                const result = await skillModel.getAllSkills(
                    searchQuery,
                    offsetValue,
                    limitValue,
                    sortQuery,
                    modeQuery,
                );
                const dataPerPage =
                    limitValue > result.rowCount ? result.rowCount : limitValue;
                if (search) {
                    if (result.rowCount > 0) {
                        const pagination = {
                            currentPage: pageValue,
                            dataPerPage: dataPerPage,
                            totalPage: Math.ceil(result.rowCount / limitValue),
                        };
                        success(res, {
                            code: 200,
                            status: 'success',
                            message: 'Success get all skills',
                            data: result.rows,
                            pagination,
                        });
                    } else {
                        failed(res, {
                            code: 500,
                            status: 'error',
                            message: `skills with keyword ${search} not found`,
                            error: [],
                        });
                    }
                } else {
                    const pagination = {
                        currentPage: pageValue,
                        dataPerPage: dataPerPage,
                        totalPage: Math.ceil(totalData / limitValue),
                    };

                    success(res, {
                        code: 200,
                        status: 'success',
                        message: `Success get all skills`,
                        data: result.rows,
                        pagination,
                    });
                }
            } else {
                failed(res, {
                    code: 400,
                    status: 'error',
                    message: 'limit and page value must be number',
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
    skillDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await skillModel.detail(id);
            if (result.rowCount > 0) {
                success(res, {
                    code: 200,
                    status: 'success',
                    message: 'Success get skill by id',
                    data: result.rows[0],
                });
            } else {
                failed(res, {
                    code: 404,
                    status: 'error',
                    message: `skill with id ${id} not found`,
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
    skillsInsert: async (req, res) => {
        try {
            const { skills, user_id } = req.body;
            const id = uuidv4();
            const data = {
                id,
                skills,
                user_id
            };
            
            await skillModel.insertSkills(data);
            success(res, {
                code: 200,
                status: 'success',
                message: 'new skills has been created',
                data: data,
            });
        } catch (error) {
            failed(res, {
                code: 500,
                status: 'error',
                message: error.message,
                error: [],
            });
        }
    },
    skillUpdate: async (req, res) => {
        try {
            const { id } = req.params;
            const { skills, user_id } = req.body;
            const skillCheck = await skillModel.detail(id);
            if (skillCheck.rowCount > 0) {
                const data = {
                    id,
                    skills,
                    user_id
                };
                await skillModel.updateSkills(data);
                const newData = await skillModel.detail(id);
                success(res, {
                    code: 200,
                    status: 'success',
                    message: 'Success update skill',
                    data: newData.rows[0],
                });
            } else {
                failed(res, {
                    code: 404,
                    status: 'error',
                    message: `skill with id ${id} not found`,
                    error: [],
                });
                return;
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
    skillDelete: async (req, res) => {
        try {
          const { id } = req.params;
          const detailSkill = await skillModel.detail(id);
          if (detailSkill.rowCount > 0) {
            await skillModel.deleteSkills(id);
            success(res, {
              code: 200,
              status: 'success',
              message: `success deleted skill with id ${id}`,
              error: [],
            });
            return;
          } else {
            failed(res, {
              code: 404,
              status: 'error',
              message: `skill with id ${id} is not found`,
              error: [],
            });
            return;
          }
        } catch (error) {
          failed(res, {
            code: 500,
            status: 'error',
            message: error.message,
            error: [],
          });
        }
      }
}

module.exports = skillController;