const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AuthModel = require('../model/Auth');
const UserModel = require('../model/User');
const {success,failure} =require('../util/common');
const { validationResult } = require("express-validator");

class AuthController{
    async login(req, res) {
        const { email, password } = req.body;
        const user = await AuthModel.findOne({ email: email });
      
        if (user) {
          const isValidPassword = await bcrypt.compare(password, user.password);
      
          if (isValidPassword) {
            console.log(isValidPassword);
            const info = await AuthModel.findOne({email: email })
            .select('-_id -name -password -createdAt -updatedAt')
            .populate('User','-password');


            console.log("Data:", info);


            res.status(200).send(success("Successfully logged in!",info));

          } else {
            res.status(400).send(failure("Invalid Credentials"));
          }
        } else {
          res.status(400).send(failure('Authentication failed!'));
        }
      }
      
    async signup(req, res) {
      try {
        const validation = validationResult(req).array();
        if (validation.length > 0) {
            return res
                .status(400)
                .send(failure("Failed to Sign Up or add as a User", validation));
        }
          const { name, username, email, password ,phone} = req.body;
          const hashedPass = await bcrypt.hash(password, 10).then((hash)=>{
            return hash;
          })
      
          const user = new UserModel({
            name: name,
            username: username,
            email: email,
            password: hashedPass,
            phone :phone
          });
      
          const savedUser = await user.save();
      
          const result = await AuthModel.create({
            name:name,
            username:username,
            email: email,
            password: hashedPass,
            User:savedUser._id
          });
      
          if (!result) {
            return res.status(400).send(failure('Signup was not successful'));
          }
      
          return res.status(200).send(success('Signup successfully', result));
        } catch (error) {
          console.log(error);
          return res.status(400).send(failure('Internal Server Error'));
        }
      }
      

}
module.exports =new AuthController();