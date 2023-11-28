import { logger } from "../../services/logger.service.js"
import { socketService } from "../../services/socket.service.js"
import { orderService } from "./order.service.js"

export async function getOrders(req, res) {
    try {
        const filterBy = {
            userId: req.query.filterBy.userId || null,
            isMsg: req.query.filterBy.isMsg || null,
            isGuest: req.query.filterBy.isGuest || null,
        }
        const sortBy = req.query.sortBy || null
        logger.debug('Getting orders', filterBy, sortBy)
        const orders = await orderService.query(filterBy, sortBy)
        res.json(orders)
    } catch (err) {
        logger.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

export async function getOrderById(req, res) {

    try {
        const orderId = req.params.id
        const order = await orderService.getById(orderId)
        res.json(order)
    } catch (err) {
        logger.error('Failed to get order', err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}

export async function addOrder(req, res) {
    const { loggedinUser } = req
    try {
        const order = req.body
        const addedOrder = await orderService.add(order)
        let otherUserId  = order.hostId === loggedinUser._id? order.buyer._id : order.hostId
        socketService.emitToUser({ type: 'order-added', data: order, userId: otherUserId })
        res.json(addedOrder)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

export async function updateOrder(req, res) {
    const { loggedinUser } = req
    try {
        const order = req.body
        const updatedOrder = await orderService.update(order)
        let otherUserId  = order.hostId === loggedinUser._id? order.buyer._id : order.hostId
        socketService.emitToUser({ type: 'order-updated', data: order, userId: otherUserId })
        res.json(updatedOrder)
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}

export async function removeOrder(req, res) {
    const { loggedinUser } = req
    try {
        const orderId = req.params.id
        await orderService.remove(orderId)
        // socketService.broadcast({ type: 'order-remove', data: orderId, userId: loggedinUser._id })
        res.send()
    } catch (err) {
        logger.error('Failed to remove order', err)
        res.status(500).send({ err: 'Failed to remove order' })
    }
}