"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { BadRequestError, ConfictRequestError } = require("../core/error.response");


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        // try {
            //Step1: check email exists?

            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                // return {
                //     code: "409",
                //     message: "Email already exists",
                //     status: "error",
                // };

                throw new BadRequestError('Error: Shop already registered')
            }

            const passwordhash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name,
                email,
                password: passwordhash,
                roles: [RoleShop.SHOP],
            });

            if(newShop){
                // Create privateKey and publicKey

                // ### complicated

                // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                // ### simple

                const publicKey = crypto.randomBytes(64).toString('hex')
                const privateKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore) {
                    return {
                        code: "409",
                        message: "keyStore error",
                        status: "error",
                    };
                }

                //Create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                // return {
                //     code: "201 <3 MoongJB check ::",
                //     metadata: {
                //         shop: getInforData({fields: ['_id', 'name', 'email'], object: newShop}),
                //         tokens
                //     },
                // }

                return {
                        shop: getInforData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                }

            }

            // return {
            //     code: "200",
            //     metadata: null
            // }
        // } catch (error) {
            // return {
            //     code: "errorxxxx",
            //     message: error.message || "Internal Server Error",
            //     status: "error",
            // };
        // }
    };
}

module.exports = AccessService;
