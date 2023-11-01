
const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Product = sequelize.define('Product',{
    id:{
        type:Sequelize.BIGINT,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    productName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    productQuantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    productPrice:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    productDescription:{
        type:Sequelize.TEXT(),
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.INTEGER,
        allowNull:false
    }}
    ,
    {
        timestamps: false
    });



module.exports = Product;