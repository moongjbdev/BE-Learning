'use strict';

const { Promise } = require('mongoose');
//su dung khoa bi quan optimistic

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTimes = 3000 // 3s tam lock

    for (let i = 0; i < retryTimes.length; i++) {
        // tao mot key, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTimes) // thanh cong = 1, fail = 0
        if (result === 1) {
            // thao tac voi inventory
            const isReversation = await reservationInventory({
                productId,
                quantity,
                cardId
            })
            if (isReversation.modifiedCount) {
                await pexpire(key, expireTimes)
                return key
            }
            return null;
        } else {
            //de thu lai
            await new Promise((resolve, reject) => setTimeout(resolve, 50))
        }
    }
}

const realeaseLock = async (keyLock) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    realeaseLock,
}