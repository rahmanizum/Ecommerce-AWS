
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const sequelize = require('./util/database');
const Product = require('./models/product');
const Customer = require('./models/customers');
const Admin = require('./models/admins');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const Forgotpasswords = require('./models/forgot-password');


const AdminRouter = require('./routes/admin');
const customerRouter = require('./routes/customer');
const paymentRouter = require('./routes/payment');
const passwordRouter = require('./routes/password')
const mainPagecontroler = require('./controllers/mainPage');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(async (request, response, next) => {
  try {
    const user = await Customer.findByPk(1);
    request.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
});



app.use('/admin', AdminRouter);
app.use('/customer', customerRouter);
app.use('/payment',paymentRouter);
app.use('/password',passwordRouter);
app.get('/', mainPagecontroler.getHomepage);
app.use(mainPagecontroler.getErrorPage)

Admin.hasMany(Product);
Product.belongsTo(Admin, { constraints: true, onDelete: 'CASCADE' });
Customer.hasOne(Cart);
Cart.belongsTo(Customer);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(Customer);
Customer.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });
Customer.hasMany(Forgotpasswords);
Forgotpasswords.belongsTo(Customer,{constraints:true,onDelete:'CASCADE'});
Admin.hasMany(Forgotpasswords);
Forgotpasswords.belongsTo(Admin,{constraints:true,onDelete:'CASCADE'});


PORT = process.env.PORT;
async function initiate() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} `);
    })
  } catch (err) {
    console.log(err);
  }
}
initiate();
