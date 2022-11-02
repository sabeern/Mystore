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

const categoryModel = require('./models/admin/categoryModel');
const subCategoryModel = require('./models/admin/subCategoryModel');
const productModel = require('./models/admin/productModel');
const cartModel = require('./models/user/cartModel');
const wishlistModel = require('./models/user/wishlistModel');
const bannerModel = require('./models/admin/bannerModel');

mongoose.connect(process.env.DBCONNECT);
app.get('/',async (req,res) => {
    res.render('./user/test');
});

//user routes

app.listen(process.env.LISTEN_PORT || 3000);