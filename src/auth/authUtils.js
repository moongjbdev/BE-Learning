'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');



const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey,(error, decode) => {
            if (error) {
                console.log('error verify:: ',error)
            }else {
                console.log('decoded verify:: ', decode)
            }
        })


        return { accessToken: accessToken, refreshToken: refreshToken}
    } catch (error) {
        
    }
}

const authenticationV2 = asyncHandler(async(req, res, next) => {
    
    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) {
        throw new AuthFailureError('Invalid request')
    }

    const keyStore = await findByUserId(userId)
    
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore')
    }

    if(req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')
                
            req.refreshToken = refreshToken
            req.user = decodeUser
            req.keyStore = keyStore
            return next()
        } catch (error) {
    
            throw error
        }
    
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid accessToken')
    }
    try {   
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey, )
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore
        return next()
    } catch (error) {

        throw error
    }

})

const authentication = asyncHandler(async(req, res, next) => {
    /*
        1- check userId missing ?
        2- get access token
        3- verify token
        4- check user in database
        5- check keyStore with userId
        6- OK-all return next()
    */



    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) {
        throw new AuthFailureError('Invalid request')
    }

    const keyStore = await findByUserId(userId)
    
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError('Invalid accessToken')
    }


    try {   
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey, )
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore
        return next()
    } catch (error) {

        throw error
    }

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT
}