'use strict';

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signIn = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logged in successfully!',
            metadata: await AccessService.signIn(req.body)
        }).send(res);
    }

    signUp = async (req, res, next) => {
        // try {
            // return res.status(201).json(await AccessService.signUp(req.body))
        // } catch (error) {
        //     next(error);
        // }
        new CREATED({
            message: 'Registered successfully!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
        
    }

}

module.exports = new AccessController;