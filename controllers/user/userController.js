const userModel = require('../../models/user/userModel');
const nodemailer = require('nodemailer');
const otpModel = require('../../models/user/otpModel');
const bcrypt = require('bcrypt');
const userExistCheck = async (req,res) => {
    const {userEmail} = req.body;
    const user = await userModel.findOne({userEmail});
    if(!user) {
        const Otp = Math.floor(1000 + Math.random() * 9999);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAIL_SENDER,
              pass: process.env.SEND_MAIL_PASS
            }
          });
          const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: 'nsabeer007@gmail.com',
            subject: 'Mystore email verification',
            html: `<p>use this code for Mystore email verification <b>${Otp}</b></p>`
          };
            transporter.sendMail(mailOptions, async function(error, info){
              if (error) {
                  console.log('network error');
              } else {
                const userOtp = new otpModel({
                  userEmail, userOtp:Otp, expiryDate:(Date.now() + 5000 * 60)
                });
                try {
                  await userOtp.save();
                }catch (err){
                  console.log(err);
                }
              }
            }); 
    }
    res.send({user,mailSendErr:false});
}
const verifyOtp = async (req,res) => {
    const {userEmail,userOtp} = req.body;
    await otpModel.deleteMany({expiryDate:{$lt:Date.now()}});
    //console.log(data2);
    const otpUser = await otpModel.findOne({$and:[{userEmail},{userOtp}]});
    res.send({otpUser});
}
const insertUser = async (req,res) => {
    const { userEmail,userName,userMobile,userPassword } = req.body;
    const hashPassword = await bcrypt.hash(userPassword,10);
    const newUser = new userModel({
        userName,userEmail,userMobile,userPassword:hashPassword,userStatus:'active',userType:'customer',delFlag:0
    });
    try {
        await newUser.save();
    }catch(err) {
        console.log('dublicate user error');
    }
    res.redirect('/');
}
const login = async (req,res) => {
    const {userEmail, userPassword} = req.body;
    let user = await userModel.findOne({userEmail});
    if(user) {
      const userPasswordCheck = await bcrypt.compare(userPassword,user.userPassword);
        if(userPasswordCheck) {
          if(user.userStatus == 'active'){ 
            req.session.user = {userId:user._id,userType:user.userType,userFullname:user.userName};
            res.send({resultMsg:false});
            return;
          }else {
            res.send({resultMsg:'Your account is blocked'});
              return;
          }
        }
    }
      res.send({resultMsg:'username or password incorrect'});
}
const logout = (req,res) => {
  if(req.session.admin) {
    req.session.user = false;
  }else {
    req.session.destroy();
  }
  res.redirect('/');
}

module.exports = {userExistCheck, insertUser, verifyOtp, login,logout};