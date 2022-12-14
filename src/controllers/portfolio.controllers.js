const { success, failed } = require('../helpers/response');
const deleteFile = require('../helpers/deleteFile');
const portfolioModel = require('../models/portfolio.models');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('../middlewares/cloudinary');

const portfolioController = {
  getAllPortfolio: async (req, res) => {
    try {
      const { search, page, limit, sort, mode } = req.query;
      const searchQuery = search || '';
      const pageValue = page ? Number(page) : 1;
      const limitValue = limit ? Number(limit) : 5;
      const offsetValue = (pageValue - 1) * limitValue;
      const sortQuery = sort ? sort : 'portfolio_name';
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
    const { name, link, type, description } = req.body;
      const id = uuidv4();
      const result = await cloudinary.uploader.upload(req.file.path)
      const photo = result.secure_url;
      const data = {
        id,
        name,
        link,
        type,
        photo,
        description
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
      console.log(error);
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
      const { name, link, type, porto_description} = req.body;
      const portfolioCheck = await portfolioModel.detail(id)      
      console.log('portfolioCheck: ', portfolioCheck);
      if (portfolioCheck.rowCount > 0) {
        const result = await cloudinary.uploader.upload(req.file.path)
        const photo = result.secure_url
        const data = {
          id,
          name,
          link,
          type,
          photo,
          porto_description
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
  portfolioAdd: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, link, type, porto_description } = req.body;
      const portfolioCheck = await portfolioModel.detail(id);
      const photo = req.file.filename;
      if (portfolioCheck.rowCount > 0) {
        const previousData = {
          name: "",
          link: "",
          type: "",
          photo: "",
          porto_description: ""          
        }
        console.log('rows: ', portfolioCheck.rows); 
        portfolioCheck.rows.map(val => {
          previousData.name = val.portfolio_name;
          previousData.link = val.link;
          previousData.type = val.type;
          previousData.photo = val.photo;
          previousData.porto_description = val.porto_description;
        })
        console.log('previousData: ', previousData);
        const data = {
          id,
          name: previousData.name.concat(",", name),
          link: previousData.link.concat(",", link),
          type: previousData.type.concat(",", type), 
          photo: previousData.photo.concat(",", photo),
          porto_description: previousData.porto_description.concat(",", porto_description)
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
      console.log('error: ', error);
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