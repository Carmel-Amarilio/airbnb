import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const orderService = {
    query,
    getById,
    remove,
    add,
    update,
}

async function query({ userId, isMsg, isGuest }, sortBy) {
    try {
        const criteria = {};

        if (isMsg && userId) {
            criteria['$or'] = [
                { 'buyer._id': userId },
                { 'hostId': userId }
            ];
        } else if (isGuest) {
            criteria['buyer._id'] = userId;
            criteria['status'] = { $ne: 'negotiations' }
        } else if (userId) {
            criteria['hostId'] = userId;
        }


        const collection = await dbService.getCollection('order');
        const orders = sortBy === 'lastUpdate' ?
            await collection.find(criteria).sort({ [sortBy]: -1 }).toArray() :
            await collection.find(criteria).sort({ [sortBy]: 1 }).toArray()
        return orders;
    } catch (err) {
        logger.error('Cannot find orders', err);
        throw err;
    }
}


async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update({ _id, hostId, buyer, totalPrice, checkIn, checkOut, guests, stay, msgs, status, lastUpdate }) {
    try {
        const orderToSave = { hostId, buyer, totalPrice, checkIn, checkOut, guests, stay, msgs, status, lastUpdate }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: orderToSave })
        return orderToSave
    } catch (err) {
        logger.error(`cannot update order ${_id}`, err)
        throw err
    }
}


