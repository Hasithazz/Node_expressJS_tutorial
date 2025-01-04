const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//this middleware function will store sequalised 'User' object to request
app.use((req, res, next) => {
  User.findByPk(1).then((user) => {
    req.user = user;
    next();
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

//Assosiations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

//Below section is only executed on initialization it will not run for incoming requests hence cannot assign 'User' to req as assigned in above
let availableUser;
sequelize
  //.sync({ force: true })
  .sync()
  .then((result) => {
    //will check and return the promise
    return User.findByPk(1);
    //Below "then" block will handle above promise
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'Hasitha Edirisinghe',
        email: 'has@gmail.com',
      });
    }
    //if you return a value inside a then block JS will automatically wrap it into promise -> Promise.resolve(user)
    return user;
  })
  .then((user) => {
    availableUser = user;
    console.log(user);
    return user.getCart();
  })
  .then((cart) => {
    if (!cart) {
      //creating cart for the user
      return availableUser.createCart();
    } else return cart;
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
