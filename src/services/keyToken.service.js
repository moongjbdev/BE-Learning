 'use strict'

const keytokenModel = require("../models/keytoken.model");

 class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens : null

            //level up
            const fillerToken = {user: userId}
            const updateToken = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }
            const optionsToken = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(fillerToken, updateToken, optionsToken)


            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
 }

 module.exports = KeyTokenService;