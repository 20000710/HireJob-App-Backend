const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const workersModel = require('../models/worker.models');

const workerController = {
  getAllWorkers: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'name';
      const modeQuery = mode ? mode : 'ASC';
      if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
        const allData = await workersModel.allData()
        // console.log("allData: ", allData)
        const totalData = allData.rows[0].total;
        const result = await workersModel.getAllWorkers(
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
              message: 'Success get all workers',
              data: result.rows,
              pagination,
            });
          } else {
            failed(res, {
              code: 500,
              status: 'error',
              message: `users with keyword ${search} not found`,
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
  workersDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await workersModel.detail(id);
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
  workersUpdate: async (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      const { name, job_desk, domicile, workplace, description, skills } = req.body;
      const workerCheck = await workersModel.detail(id);
      if (workerCheck.rowCount > 0) {
        const data = {
          id,
          name,
          job_desk,
          domicile,
          workplace,
          description,
          skills
        };
        await workersModel.workersUpdateData(data);
        const newData = await workersModel.detail(id);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success update worker',
          data: newData.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `worker with id ${id} not found`,
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
  workersUpdatePhoto: async (req, res) => {
    try {
      const id = req.APP_DATA.tokenDecoded.id;
      let photo;
      if (req.file) {
        const usersCheck = await workersModel.detail(id);
        if (usersCheck.rowCount > 0) {
          if (usersCheck.rows[0].photo == 'user_default.png') {
            photo = req.file.filename;
            const data = {
              id,
              photo,
            };
            await workersModel.workersUpdatePhotoData(data);
            const newData = await workersModel.detail(id);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success update worker photo',
              data: newData.rows[0],
            });
          } else {
            deleteFile(`public/${usersCheck.rows[0].photo}`);
            photo = req.file.filename;
            const data = {
              id,
              photo,
            };
            await workersModel.workersUpdatePhotoData(data);
            const newData = await usersModel.detail(id);
            success(res, {
              code: 200,
              status: 'success',
              message: 'Success update worker photo',
              data: newData.rows[0],
            });
          }
        } else {
          deleteFile(`public/${req.file.filename}`);
          failed(res, {
            code: 404,
            status: 'error',
            message: `worker with id ${id} not found`,
            error: [],
          });
          return;
        }
      } else {
        failed(res, {
          code: 400,
          status: 'error',
          message: 'worker photo is required',
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

module.exports = workerController;