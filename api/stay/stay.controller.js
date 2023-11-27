import { logger } from "../../services/logger.service.js"
import { socketService } from "../../services/socket.service.js"
import { stayService } from "./stay.service.js"

export async function getStays(req, res) {

    try {
        const filterBy = {
            userId: req.query.userId || null,
            label: req.query.label || null,
            destinations: req.query.destinations || null,
            checkIn: req.query.checkIn || null,
            checkOut: req.query.checkOut || null,
            guests: req.query.guests || null,
            wishlist: req.query.wishlist || null,
        }
        logger.debug('Getting Stays', filterBy)
        const stays = await stayService.query(filterBy)
        res.json(stays)
    } catch (err) {
        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

export async function getStayById(req, res) {

    try {
        const stayId = req.params.id
        const stay = await stayService.getById(stayId)
        res.json(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

export async function addStay(req, res) {
    const { loggedinUser } = req
    try {
        const stay = req.body
        const addedStay = await stayService.add(stay)
        // socketService.broadcast({ type: 'toy-added', data: toy, userId: loggedinUser._id })
        res.json(addedStay)
    } catch (err) {
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

export async function updateStay(req, res) {
    try {
        const stay = req.body
        const updatedStay = await stayService.update(stay)
        res.json(updatedStay)
    } catch (err) {
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })
    }
}

export async function removeStay(req, res) {
    const { loggedinUser } = req
    try {
        const stayId = req.params.id
        await stayService.remove(stayId)
        // socketService.broadcast({ type: 'toy-remove', data: toyId, userId: loggedinUser._id })
        res.send()
    } catch (err) {
        logger.error('Failed to remove stay', err)
        res.status(500).send({ err: 'Failed to remove stay' })
    }
}

// export async function updateStayLikes(req, res) {
//     const { loggedinUser } = req
//     try {
//         const stayId = req.params.id
//         const stay = await stayService.getById(stayId)
//         console.log(stay);
//         const likeIndx = stay.likedByUsers.findIndex((user) => user._id === loggedinUser._id)
//         if (likeIndx >= 0) stay.likedByUsers.splice(likeIndx, 1)
//         else stay.likedByUsers.push(loggedinUser)
//         console.log(stay);
//         // res.json(updateStay)
//     } catch (err) {
//         logger.error('Failed to update stay likes', err)
//         res.status(500).send({ err: 'Failed to update stay likes' })
//     }
// }

