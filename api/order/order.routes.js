import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getOrders, getOrderById, addOrder, updateOrder, removeOrder } from './order.controller.js'
import { validateOrder } from '../../middlewares/validator.middleware.js'

export const orderRoutes = express.Router()

orderRoutes.get('/', getOrders)
orderRoutes.get('/:id', getOrderById)
orderRoutes.post('/', requireAuth, validateOrder, addOrder)
orderRoutes.put('/', requireAuth, validateOrder, updateOrder)
orderRoutes.delete('/:id', requireAuth, removeOrder)
