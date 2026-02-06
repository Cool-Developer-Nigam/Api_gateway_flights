const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const {Auth }=require('../utils/common');
const {checkPassword}=Auth;

const bcrypt = require('bcrypt');

const userRepo=new UserRepository();

async function create(data){
    try {
        const user=await userRepo.create(data);
        return user;
    } catch (error) {
      
        if(error.name=='SequelizeValidationError'||error.name=='SequelizeUniqueConstraintError'){
            let explanation=[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            error.explanation=explanation;
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data){
    try {
        const user=await userRepo.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }

        const passwordMatch=await checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Password is incorrect', StatusCodes.BAD_REQUEST);
        }

        const token=await Auth.createToken({id:user.id,email:user.email});
        return { token };
    } catch (error) {
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Cannot fetch data of user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try {
        if(!token){
            throw new AppError('Token not found', StatusCodes.BAD_REQUEST);
        } 

        const response=await Auth.verifyToken(token);
        const user=await userRepo.get(response.id);
        if(!user){
            throw new AppError('No user found for the given token', StatusCodes.NOT_FOUND);
        }
        return user.id;
    }
    catch (error) {
        if(error instanceof AppError){
            throw error;
        }   
        throw new AppError('Token verification failed', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports={
    create,
    signIn,
    isAuthenticated
}