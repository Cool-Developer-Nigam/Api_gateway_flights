const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AppError = require('../errors/app-error');
const { StatusCodes } = require('http-status-codes');

const { ServerConfig } = require('../../config');
const serverConfig = require('../../config/server-config');

async function checkPassword(plainPassword,encryptedPassword){
    try {
        return await bcrypt.compare(plainPassword,encryptedPassword);
    } catch (error) {
        throw new AppError('Something went wrong while comparing password', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function createToken(input){
    try{
return jwt.sign(input,serverConfig.JWT_SECRET_KEY,{expiresIn:serverConfig.JWT_EXPIRES_IN});
    }
    catch(error){
        throw new AppError('Cannot create token', StatusCodes.INTERNAL_SERVER_ERROR);
    }

}

async function verifyToken(token){
    try{
        return jwt.verify(token,serverConfig.JWT_SECRET_KEY);
    }
    catch(error){
        throw new AppError('Token verification failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    checkPassword,
    createToken,
    verifyToken
}