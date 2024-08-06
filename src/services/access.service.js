"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInforData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");


const { findByEmail } = require("./shop.service");
const keytokenModel = require("../models/keytoken.model");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN',
}
class AccessService {

    static handlerRefeshToken = async (refreshToken) => {
        /*
         1- Check this token used?

 
        */

         const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
         // Yes
         if(foundToken) {
            // decode xem la ai??
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            // xoa
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happened! Please re-login')
         }
        // No, qua ngon!
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) {
            throw new AuthFailureError('Error: Shop not registered 1')
        }

        // verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        // check userId

        const foundShop = await findByEmail({email})
        if (!foundShop) {
            throw new AuthFailureError('Error: Shop not registered 2')
        }

        // Create new token pair 
        const tokens = await createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey)
        //Update token
        await keytokenModel.updateOne(
            { _id: holderToken._id },
            {
                $set: {
                    refreshToken: tokens.refreshToken,
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken // đã được sử dụng để lấy token mới rồi
                }
            }
        );

        return {
            user:{userId, email},
            tokens
        }
    }

    static signIn = async ({ email, password, refreshToken = null }) => {
        //Email
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found')
        }
        //Password
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError('Error: Invalid password')
        }
        //Created token
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })
        return {
            shop: getInforData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }




    }

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

        if (newShop) {
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

            if (!keyStore) {
                return {
                    code: "409",
                    message: "keyStore error",
                    status: "error",
                };
            }

            //Create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            // return {
            //     code: "201 <3 MoongJB check ::",
            //     metadata: {
            //         shop: getInforData({fields: ['_id', 'name', 'email'], object: newShop}),
            //         tokens
            //     },
            // }

            return {
                shop: getInforData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }

        }

        return {
            code: "200",
            metadata: null
        }
        // } catch (error) {
        // return {
        //     code: "errorxxxx",
        //     message: error.message || "Internal Server Error",
        //     status: "error",
        // };
        // }
    };

    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey;
    }
}   

module.exports = AccessService;
