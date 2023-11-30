import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'


export const stayService = {
    remove,
    query,
    getById,
    add,
    update,
}


async function query({ userId, wishlist, label, destinations, checkIn, checkOut, guests }) {
    try {
        const criteria = {};
        if (userId) criteria['host._id'] = userId;
        else if (wishlist) criteria['likedByUsers'] = { $elemMatch: { _id: wishlist } }
        else {
            if (destinations) {
                criteria['$or'] = [];
                const caseInsensitiveRegex = new RegExp(destinations, 'i');
                criteria['$or'].push(
                    { 'loc.country': { $regex: caseInsensitiveRegex } },
                    { 'loc.city': { $regex: caseInsensitiveRegex } }
                );
            }
            if (guests) criteria['capacity.guests'] = { $gte: +guests.adults + +guests.children }
            if (label && label != 'All') criteria['labels'] = { $in: [label] }
            else if (label && label === 'All') criteria
            if (checkIn && checkOut) criteria['DateNotAvailable'] = { $nin: utilService.getDatesBetween(checkIn, checkOut) }
        }

        const collection = await dbService.getCollection('stay');
        const stays = await collection.find(criteria).toArray();
        return stays;
    } catch (err) {
        logger.error('Cannot find stays', err);
        throw err;
    }
}




async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: ObjectId(stayId) })
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update({ _id, name, type, imgUrls, price, summary, capacity, amenities, labels, host, loc, reviews, likedByUsers, DateNotAvailable }) {
    try {
        const stayToSave = { name, type, imgUrls, price, summary, capacity, amenities, labels, host, loc, reviews, likedByUsers, DateNotAvailable }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: stayToSave })
        return stayToSave
    } catch (err) {
        logger.error(`cannot update stay ${_id}`, err)
        throw err
    }
}


