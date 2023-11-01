
const Product = require('../models/product');
const Admin = require('../models/admins');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
exports.adminHomePage = (request, response, next) => {
    response.sendFile('home.html', { root: 'views/admin' });
}

exports.adminSignup = async (request, response, next) => {
    try {
        const { name, email, phonenumber, password } = request.body;
        let adminExist = await Admin.findOne({
            where: {
                [Op.or]: [{ email }, { phonenumber }]
            }
        });
        if (!adminExist) {
            const hash = await bcrypt.hash(password, 10);
            const admin = await Admin.create({ name, email, phonenumber, password: hash });
            const token = jwt.sign({ adminId: admin.id }, secretKey, { expiresIn: '1h' });
            response.cookie('token', token, { maxAge: 3600000 });
            return response.status(201).json({ message: "Admin Account created successfully" });
        } else {
            return response.status(409).json({ message: 'Email or Phone Number already exist!' })
        }


    } catch (error) {
        console.log(error);
    }
}
exports.adminSignin = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        let adminExist = await Admin.findOne({ where: { email } })
        if (adminExist) {
            const isPasswordValid = await bcrypt.compare(password, adminExist.password);
            if (isPasswordValid) {
                const token = jwt.sign({ adminId: adminExist.id }, secretKey, { expiresIn: '1h' });
                response.cookie('token', token, { maxAge: 3600000 });
                return response.status(201).json({ message: "Username and password correct" })
            } else {
                return response.status(401).json({ message: 'Invalid Password!' })
            }
        } else {
            return response.status(409).json({ message: 'Account is not exist!' })
        }


    } catch (error) {
        console.log(error);
    }
}
exports.addproduct = async (request, response, next) => {
    try {
        const { productName, productQuantity, productPrice, productDescription, imageUrl } = request.body;
        await request.admin.createProduct({
            productName,
            productPrice,
            productQuantity,
            productDescription,
            imageUrl

        })
        return response.status(201).json({ message: "Product created successfully" });
    } catch (err) {
        console.error(err);
        response.status(500).json({message:'Internal Server Error unable to add product'});
    }
}
exports.getProducts = async (request, response, next) => {
    try {
        const pageNo = request.query.pageNo;
        const admin = request.admin;
        const limit = Number(request.query.noProducts);
        const offset = (pageNo - 1) * limit;
        const products = await admin.getProducts({
            offset: offset,
            limit: limit
        });
        response.status(200).json({
            products,
            newHasMoreProducts : products.length === limit,
            newHasPreviousProducts : pageNo > 1
        });

    } catch (error) {
        console.error(error);
        response.status(500).json({message:'Internal Server Error unable to getproducts'});
    }
}
exports.getProduct = async (request,response,next) =>{
    try {
        const productId = request.params.productId;
        const admin = request.admin
        const product = await admin.getProducts({where:{id:productId}});
        return response.status(201).json({product:product[0], message: "Product fetched successfully" });
        
    } catch (error) {
        console.error(error);
        response.status(500).json({message:'Internal Server Error unable to getproduct'});
    }
}
exports.updateProduct = async (request, response, next) => {
    try {
        const productId = request.params.productId;
        const { productName, productQuantity, productPrice, productDescription, imageUrl } = request.body;
        const product = await Product.findByPk(productId);
        if(product){
           await product.update({
                 productName,
                 productQuantity,
                 productPrice,
                 productDescription,
                 imageUrl
                })
                return response.status(200).json({ message: "Product updated successfully"});
        }else{
            return response.status(404).json({ message: "Product not found" }); 
        }
        
    } catch (err) {
        console.error(err);
        response.status(500).json({ message: 'Internal Server Error unable to update product' });
    }
}
exports.deleteProduct = async (request,response,next) =>{
    try {
        const productId = request.params.productId;
        const res = await Product.destroy({ where: { id: productId } });
        if(res){
            return response.status(200).send('Product Successfully Deleted');
        }else{
            return response.status(404).json({ message: "Product not found" }); 
        }
        
    } catch (error) {
        console.error(error);
        response.status(500).json({message:'Internal Server Error unable to delete product'});       
    }
}
