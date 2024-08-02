'use strict';

const JWT = require('jsonwebtoken');
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
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

module.exports = {
    createTokenPair,
}