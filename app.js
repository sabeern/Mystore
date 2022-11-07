const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
const store = new MongoDBStore({
  uri: process.env.DBCONNECT,
  collection: process.env.SESSION_COLLECTION
});
store.on('error', function (error) {
  console.log(error);
});

app.use(flash());
app.use(express.json());
app.use(session({
  secret: process.env.SECERET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DBCONNECT);
//user routes import
const homeRouter = require('./routes/user/home');
const userRouter = require('./routes/user/user');
const cartRouter = require('./routes/user/cart');
const wishlistRouter = require('./routes/user/wishlist');
const profileRouter = require('./routes/user/profile');
const staticPageRouter = require('./routes/user/staticPage');

//admin routes import
const adminLoginRouter = require('./routes/admin/login');
const adminCategoryRoutes = require('./routes/admin/category');
const adminSubCategoryRoutes = require('./routes/admin/subCategory');
const adminBrandRoutes = require('./routes/admin/brand');
const adminPackingRoutes = require('./routes/admin/packing');
const adminProductRoutes = require('./routes/admin/product');
const adminUserRoutes = require('./routes/admin/user');
const adminOrderRoutes = require('./routes/admin/order');
const bannerRoutes = require('./routes/admin/banner');
const couponRoutes = require('./routes/admin/coupon');

//user routes
app.use(homeRouter);
app.use('/ap',userRouter);
app.use('/gp',cartRouter);
app.use('/gp',wishlistRouter);
app.use('/account',profileRouter);
app.use('/shop',staticPageRouter);

//admin routes
app.use('/admin',adminLoginRouter);
app.use('/admin/category',adminCategoryRoutes);
app.use('/admin/subCategory',adminSubCategoryRoutes);
app.use('/admin/brand',adminBrandRoutes);
app.use('/admin/packing',adminPackingRoutes);
app.use('/admin/product',adminProductRoutes);
app.use('/admin/user',adminUserRoutes);
app.use('/admin/order',adminOrderRoutes);
app.use('/admin/banner',bannerRoutes);
app.use('/admin/coupon',couponRoutes);
/*app.use((req, res) => {
  res.redirect('/');
});*/
app.listen(process.env.LISTEN_PORT || 3000);