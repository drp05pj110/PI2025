import dotenv from 'dotenv'
dotenv.config()

import './src/database'
import express from 'express'
import homeRoutes from './src/routes/homeRoutes'
import userRoutes from './src/routes/userRoutes'
import tokenRoutes from './src/routes/tokenRoutes'
import employeeRoutes from './src/routes/employeeRoutes'
import customerRoutes from './src/routes/customerRoutes'
import addressRoutes from './src/routes/addressRoutes'
import contactRoutes from './src/routes/contactRoutes'
import productRoutes from './src/routes/productRoutes'
import categoryRoutes from './src/routes/categoryRoutes'
import serviceOrderRoutes from './src/routes/serviceOrderRoutes'
import serviceOrderCategoryRoutes from './src/routes/serviceOrderCategoryRoutes'
import serviceOrderProductRoutes from './src/routes/serviceOrderProductRoutes'
import serviceOrderEmployeeRoutes from './src/routes/serviceOrderEmployeeRoutes'
import serviceOrderContactRoutes from './src/routes/serviceOrderContactRoutes'
import budgetRoutes from './src/routes/budgetRoutes'
import photoRoutes from './src/routes/photoRoutes'
import cors from 'cors';

class App {
    constructor(){
        this.app = express()
        this.middlewares()
        this.routes()
    }

    middlewares(){
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())
        // Configuração do CORS
        this.app.use(cors({
            origin: ['http://localhost:3000', 'http://192.168.0.18:3000'],// Permite solicitações do frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
            credentials: true, // Permite envio de cookies e credenciais, se necessário
        }))

    }

    routes(){
        this.app.use('/', homeRoutes)
        this.app.use('/users/', userRoutes)
        this.app.use('/tokens', tokenRoutes)
        this.app.use('/employees', employeeRoutes)
        this.app.use('/customers', customerRoutes)
        this.app.use('/addresses', addressRoutes)
        this.app.use('/contacts', contactRoutes)
        this.app.use('/products', productRoutes)
        this.app.use('/categorys', categoryRoutes)
        this.app.use('/serviceorders', serviceOrderRoutes)
        this.app.use('/serviceorderscategories', serviceOrderCategoryRoutes)
        this.app.use('/serviceordersproducts', serviceOrderProductRoutes)
        this.app.use('/serviceordersemployees', serviceOrderEmployeeRoutes)
        this.app.use('/serviceorderscontacts', serviceOrderContactRoutes)
        this.app.use('/budget', budgetRoutes)
        this.app.use('/photos', photoRoutes)
    }
}

export default new App().app