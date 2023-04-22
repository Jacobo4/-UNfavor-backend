import bcrypt from "bcrypt";
import jwtService from "../authenticate/jwt.service";
import User from './user.model';
import Favor from '../favor/favor.model';

const userService = {
  getInfo: async function (userId){
    let user = await User.findById(userId).exec();
    if(!user) throw new Error(`User not found`);
    return user;
  },
  signup: async function (info){
    if(!info.password) throw new Error(`Password is required`);
    info.password = bcrypt.hashSync(info.password, bcrypt.genSaltSync(10));

    var user = new User(info);
    if(!user) throw new Error(`Error creating user`);

    var result = await user.save();
    if(!result) throw new Error(`Error saving user`);
    if(result) return result;
  },
  login: async function (info){
    const { email, password } = info;
    var user = await User.findOne({ email });
    if (!user) throw new Error(`Invalid credentials`);

    var validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error(`Invalid credentials`);

    var tokens = jwtService.generate(user._id, user.email);
    return { user, tokens };
  },
  logout: async function (){
    return jwtService.logout();
  },
  refresh: async function (info){
    var refreshToken = info.headers.refreshtoken;
    if(!refreshToken) throw new Error(`Refresh token is required`);

    let payload = await jwtService.verify(refreshToken, process.env.JWT_REFRESH);
    if(!payload) throw new Error(`Invalid refresh token`);

    var accessToken = jwtService.generate(payload.id, payload.email).access;
    if(!accessToken) throw new Error(`Error generating access token`);
    return accessToken;
  },
  createFavor: async function (favorData){
    let favor = new Favor(favorData);
    console.log("FAVOR: ", favor);
    if(!favor) throw new Error(`Error creating favor`);

    let result = await favor.save();
    if(!result) throw new Error(`Error saving favor`);

    return result;
  },
  getUser: async function (userId){
    let user = await User.findById(userId).exec();
    if(!user) throw new Error(`User not found`);
    return user;
  }
}

export default userService;
