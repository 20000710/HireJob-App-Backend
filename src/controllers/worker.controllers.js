const { success, failed, successWorker } = require('../helpers/response');
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
      const sortQuery = sort ? sort : 'worker.name';
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
        console.log('res: ', result)
        const data = {
          id: "",
          name: "",
          email: "",
          phone: "",
          password: "",
          skills: "",
          photo: "",
          domicile: "",
          workplace: "",
          job_desk: "",
          description: ""
        }

        const experience = {
          position: "",
          company_name: "",
          started: "",
          ended: "",
          photo: "",
          description: ""
        }

        const portfolio = {
          link: "",
          type: "",
          photo: "",
          description: "",
          portfolio_name: ""
        }

        // mapping to show data worker
        result.rows.map((val) => {
          data.id = val.id
          data.name = val.name
          data.email = val.email
          data.phone = val.phone
          data.password = val.password
          data.skills = val.skills
          data.photo = val.photo
          data.domicile = val.domicile
          data.workplace = val.workplace
          data.job_desk = val.job_desk
          data.description = val.worker_description
        })
        // mapping to show data experience
        result.rows.map((val) => {
          experience.position = val.position
          experience.company_name = val.company_name
          experience.started = val.started
          experience.ended = val.ended
          experience.photo = val.photo
          experience.description = val.exp_description
        })
        // mapping to show data portfolio
        result.rows.map((val) => {
          portfolio.link = val.link
          portfolio.type = val.type
          portfolio.photo = val.photo
          portfolio.description = val.porto_description
          portfolio.portfolio_name = val.portfolio_name
        })

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
              data: data,
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
          successWorker(res, {
            code: 200,
            status: 'success',
            message: `Success get all users`,
            data: [data],
            experience: [experience],
            portfolio: [portfolio],
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
        const data = {
          id: "",
          name: "",
          email: "",
          phone: "",
          password: "",
          skills: "",
          photo: "",
          domicile: "",
          workplace: "",
          job_desk: "",
          description: ""
        }

        const experience = {
          position: "",
          company_name: "",
          started: "",
          ended: "",
          photo: "",
          description: ""
        }

        const portfolio = {
          link: "",
          type: "",
          photo: "",
          description: "",
          portfolio_name: ""
        }

        // mapping to show data worker
        result.rows.map((val) => {
          data.id = val.id
          data.name = val.name
          data.email = val.email
          data.phone = val.phone
          data.password = val.password
          data.skills = val.skills
          data.photo = val.photo
          data.domicile = val.domicile
          data.workplace = val.workplace
          data.job_desk = val.job_desk
          data.description = val.worker_description
        })
        // mapping to show data experience
        result.rows.map((val) => {
          experience.position = val.position
          experience.company_name = val.company_name
          experience.started = val.started
          experience.ended = val.ended
          experience.photo = val.photo
          experience.description = val.exp_description
        })
        // mapping to show data portfolio
        result.rows.map((val) => {
          portfolio.link = val.link
          portfolio.type = val.type
          portfolio.photo = val.photo
          portfolio.description = val.porto_description
          portfolio.portfolio_name = val.portfolio_name
        })

        successWorker(res, {
          code: 200,
          status: 'success',
          message: 'Success get worker by id',
          data: [data],
          experience: [experience],
          portfolio: [portfolio],
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
      console.log('error: ', error);
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
      const { name, job_desk, domicile, workplace, description, skills, portfolio_id, experience_id } = req.body;
      const workerCheck = await workersModel.detail(id);
      console.log('workerCheck: ', workerCheck);
      if (workerCheck.rowCount > 0) {

        const data = {
          id,
          name,
          job_desk,
          domicile,
          workplace,
          description,
          skills,
          portfolio_id,
          experience_id,
        };
        await workersModel.workersUpdateData(data);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success update worker',
          data: workerCheck.rows[0],
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
      console.log('error: ', error);
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
      const { id } = req.params;
      let photo;
      if (req.file) {
        const usersCheck = await workersModel.detail(id);
        if (usersCheck.rowCount > 0) {
          if (usersCheck.rows[0].photo == null) {
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
            const newData = await workersModel.detail(id);
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