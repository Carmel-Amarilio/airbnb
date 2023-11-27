import express from 'express'
import { login, signup, logout } from './auth.controller.js'
import { validateSignup } from '../../middlewares/validator.middleware.js'

export const authRoutes = express.Router()

authRoutes.post('/login', login)
authRoutes.post('/signup',validateSignup, signup)
authRoutes.post('/logout', logout)