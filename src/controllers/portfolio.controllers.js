const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const portfolioModel = require('../models/portfolio.models');
const { v4: uuidv4 } = require('uuid');

const portfolioController = {
  getAllPortfolio: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'name';
      const modeQuery = mode ? mode : 'ASC';
      if (typeof Number(page) == 'number' && typeof Number(limit) == 'number') {
        const allData = await portfolioModel.allData()
        console.log("allData: ", allData)
        const totalData = allData.rows[0].total;
        const result = await portfolioModel.getAllPortfolio(
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
              message: 'Success get all portfolio',
              data: result.rows,
              pagination,
            });
          } else {
            failed(res, {
              code: 500,
              status: 'error',
              message: `portfolio with keyword ${search} not found`,
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
            message: `Success get all potfolio`,
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
  portfolioDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await portfolioModel.detail(id);
      if (result.rowCount > 0) {
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success get portfolio by id',
          data: result.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `portfolio with id ${id} not found`,
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
  portfolioInsert: async (req, res) => {
    try {
    const { name, link, type, description, user_id } = req.body;
      const id = uuidv4();
      const photo = req.file.filename;
      const data = {
        id,
        name,
        link,
        type,
        photo,
        description,
        user_id
      };
      console.log('data: ', data)
      await portfolioModel.insertPortfolio(data);
      success(res, {
        code: 200,
        status: 'success',
        message: 'new portfolio has been created',
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
  portfolioUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, link, type, description, user_id} = req.body;
      const portfolioCheck = await portfolioModel.detail(id);
      const photo = req.file.filename;
      if (portfolioCheck.rowCount > 0) {
        const data = {
          id,
          name,
          link,
          type,
          photo,
          description,
          user_id
        };
        await portfolioModel.updatePortfolio(data);
        success(res, {
          code: 200,
          status: 'success',
          message: 'Success update portfolio',
          data: portfolioCheck.rows[0],
        });
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `portfolio with id ${id} not found`,
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
  portfolioDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const detailPortfolio = await portfolioModel.detail(id);
      if (detailPortfolio.rowCount > 0) {
        await portfolioModel.deletePortfolio(id);
        success(res, {
          code: 200,
          status: 'success',
          message: `success deleted portfolio with id ${id}`,
          error: [],
        });
        return;
      } else {
        failed(res, {
          code: 404,
          status: 'error',
          message: `portfolio with id ${id} is not found`,
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

module.exports = portfolioController;