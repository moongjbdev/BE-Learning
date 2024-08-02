"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInforData } = require("../utils");


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITER',
    ADMIN: 'ADMIN',
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            //Step1: check email exists?

            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: "409",
                    message: "Email already exists",
                    status: "error",
                };
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
                const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                console.log('Public Key: :  :   :' + publicKeyString)

                if(!publicKeyString) {
                    return {
                        code: "409",
                        message: "publicKey error",
                        status: "error",
                    };
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                console.log('publicKeyObject:::: ', publicKeyObject)

                //Create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyObject, privateKey)
                console.log('created token successful::', tokens)
                return {
                    code: "201",
                    metadata: {
                        shop: getInforData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    },
                }

            }

            return {
                code: "200",
                metadata: null
            }
        } catch (error) {
            return {
                code: "errorxxxx",
                message: error.message || "Internal Server Error",
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
