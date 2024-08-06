'use strict';

const statusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
};

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden error',
    CONFLICT: 'Conflict error'
};

const {
    StatusCodes, ReasonPhrases
} = require('../utils/httpStatusCode');
const statusCodes = require('../utils/statusCodes');

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, status = statusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, status = statusCode.FORBIDDEN) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED){
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = statusCodes.NOT_FOUND){
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
};
