import Sequelize from "sequelize"
import databaseConfig from '../config/database'
import User from '../models/User'
import Employee from '../models/Employee'
import Customer from '../models/Customer'
import Address from '../models/Address'
import Contact from '../models/Contact'
import Product from "../models/Product"
import Category from '../models/Category'
import ServiceOrder from "../models/ServiceOrder"
import ServiceOrderCategory from '../models/ServiceOrderCategory'
import ServiceOrderProduct from '../models/ServiceOrderProduct'
import ServiceOrderEmployee from '../models/ServiceOrderEmployee'
import ServiceOrderContact from '../models/ServiceOrderContact'
import Budget from '../models/Budget'

const models = [User, Employee, Customer, Address, Contact, Product, Category, 
    ServiceOrder, ServiceOrderCategory, ServiceOrderProduct, ServiceOrderEmployee,
    ServiceOrderContact, Budget
]

const connection = new Sequelize(databaseConfig)

models.forEach((model)=> model.init(connection))