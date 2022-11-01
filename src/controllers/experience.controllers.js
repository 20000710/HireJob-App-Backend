const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const experienceModel = require('../models/experience.models');
const { v4: uuidv4 } = require('uuid');

const experienceController = {
  getAllExperience: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'company_name';
      const modeQuery = mode ? mode : 'ASC';
      if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
        const allData = await experienceModel.allData()
        console.log("allData: ", allData)
        const totalData = allData.rows[0].total;
        const result = await experienceModel.getAllExperience(
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
              message: 'Success get all experience',
              data: result.rows,
              pagination,
            });
          } else {
            failed(res, {
              code: 500,
              status: 'error',
              message: `experience with keyword ${search} not found`,
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
            message: `Success get all users`,
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
  experienceDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await experienceModel.detail(id);
      if (result.rowCount > 0) {
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success get worker by id',
          data: result.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `worker with id ${id} not found`,
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
  experienceInsert: async (req, res) => {
    try {
      const { position, company_name, started, ended, description } = req.body;
      const id = uuidv4();
      const company_photo = req.file.filename;
      console.log('company_photo: ', company_photo);
      const data = {
        id,
        position,
        company_name,
        started,
        ended,
        company_photo,
        description
      };
      console.log('data: ', data)
      await experienceModel.insertExperience(data);
      success(res, {
        code: 200,
        status: 'success',
        message: 'new experience has been created',
        data: data,
      });
    } catch (error) {
      failed(res, {
        code: 500,
        status: 'error',
        message: error,
        error: [],
      });
    }
  },
  experienceUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { position, company_name, started, ended, company_photo, description } = req.body;
      const experienceCheck = await experienceModel.detail(id);
      if (experienceCheck.rowCount > 0) {
        const data = {
          id,
          position,
          company_name,
          started,
          ended,
          company_photo,
          description
        };
        await experienceModel.updateExperience(data);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success update experience',
          data: experienceCheck.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `experience with id ${id} not found`,
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
  experienceDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const detailExperience = await experienceModel.detail(id);
      if (detailExperience.rowCount > 0) {
        await experienceModel.deleteExperience(id);
        success(res, {
          code: 200,
          status: 'success',
          message: `success deleted experience with id ${id}`,
          error: [],
        });
        return;
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `experience with id ${id} is not found`,
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

module.exports = experienceController;