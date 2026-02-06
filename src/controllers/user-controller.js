const {StatusCodes}=require('http-status-codes');

const {UserService}= require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

/**
 * 
 *POST :/signup
 *req-body{email:'email address', password:'password'}
 */


async function createUser(req, res) {
    console.log('createUser called');
    try {
        const user = await UserService.create({
           email: req.body.email,
           password: req.body.password
        });
        SuccessResponse.data = user;
        SuccessResponse.message = 'User created successfully';
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        ErrorResponse.message = 'Something went wrong while creating user';
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}


module.exports = {
    createUser
}
   