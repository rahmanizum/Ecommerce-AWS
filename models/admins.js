const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Admin = sequelize.define('Admin',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type : Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false
    },
    phonenumber:{
        type: Sequelize.BIGINT(10),
        unique: true,
        allowNull: false
    },
    password:{
        type: Sequelize.TEXT,
        allowNull:false 
    }},
    {
        timestamps: false
    }
)
module.exports=Admin;