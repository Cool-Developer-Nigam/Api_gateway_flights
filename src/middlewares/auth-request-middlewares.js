const {StatusCodes} = require('http-status-codes');

const {ErrorResponse} = require('../utils/common');

const AppError = require('../utils/errors/app-error');

const {UserService} = require('../services');


function validateAuthRequest(req, res, next) {
    if (!req.body.email ) {

        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('Email  not found in the request body', StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (!req.body.password) {

        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = new AppError('Password not found in the request body', StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }   
    next();
}

async function checkAuth(req, res, next) {
    try {
        const isAuthenticated = await UserService.isAuthenticated(req.headers['x-access-token'] || req.headers['authorization']);
        if (!isAuthenticated) {
            ErrorResponse.message = 'Something went wrong while authenticating user';
            ErrorResponse.error = new AppError('User is not authenticated', StatusCodes.UNAUTHORIZED);
            return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
        }
        next();
    }
    catch (error) {
        ErrorResponse.message = 'Something went wrong while authenticating user';
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


module.exports = {
    validateAuthRequest,
    checkAuth
}