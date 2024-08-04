'use strict';

const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

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