'use strict';

const { findById } = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key) {
            return res.status(403).json({ 
                message: 'API Key is required // Forbidden Error' 
            })
        }

        // check objKey
        const objKey = await findById(key)

        if(!objKey) {
            return res.status(403).json({ 
                message: 'Invalid API Key // Forbidden Error' 
            })
        }

        req.objKey = objKey

        return next()
    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({ 
                message: 'No permissions // Forbidden Error' 
            })
        }

        console.log("Permission::::   ",req.objKey.permissions)
        const validPermissions = req.objKey.permissions.includes(permission)
        if(!validPermissions) {
            return res.status(403).json({ 
                message: 'Permission denied'
            })
        }

        return next()
    }
}


module.exports = {
    apiKey,
    permission
}