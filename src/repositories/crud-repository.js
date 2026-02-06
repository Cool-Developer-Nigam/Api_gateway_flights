const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
            const response = await this.model.create(data);
            return response;
    }

    async destroy(data) {
           const response = await this.model.destroy({
                where: { id: data }
            });

            if(response===0){
                throw new AppError('Not able to found the entity',StatusCodes.NOT_FOUND);
            }
            return response;
    }

    async get(data) {
            const response = await this.model.findByPk(data);
            if(!response){
                throw new AppError('Not able to find the entity',StatusCodes.NOT_FOUND);
            }
            return response;
    }

    async getAll(filters = {}) {
            const response = await this.model.findAll({
                where: filters
            });
            return response;
    }

    async update(id, data) {
            const response = await this.model.update(data, {
                where: { id: id }
            });
            return response;
    }

}
module.exports = CrudRepository;