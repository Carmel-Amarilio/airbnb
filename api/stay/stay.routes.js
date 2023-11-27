import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { validateStay } from '../../middlewares/validator.middleware.js'
import { addStay, getStayById, getStays, removeStay, updateStay } from './stay.controller.js'

export const stayRoutes = express.Router()

stayRoutes.get('/', getStays)
stayRoutes.get('/:id', getStayById)
stayRoutes.post('/', requireAuth, validateStay, addStay)
stayRoutes.put('/', requireAuth, validateStay, updateStay)
stayRoutes.delete('/:id', requireAuth, removeStay)

// stayRoutes.put('/like/:id', requireAuth, updateStayLikes)
