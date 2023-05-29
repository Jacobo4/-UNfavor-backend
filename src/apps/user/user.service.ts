import bcrypt from 'bcrypt';
import jwtService from '../authenticate/jwt.service';
import User, { IUser, IFavor } from './user.model';
import Subscription from './suscribe.model';
import { _ } from "lodash";
import axios from 'axios';
import {IUserInfo, IChatUser, ITokens} from '../typescriptCrap/userTypes';
import { ObjectId } from 'mongoose';
import UserReport, { IUserReport } from './userReport.model';
import MatchService from "../match/match.service";

const userService = {
  getUserInfo: async function (userId: ObjectId): Promise<IUser> {
    let user: IUser = await User.findById(userId).select('-password -admin').exec();
    if (!user) throw new Error(`User not found`);
    return user;
  },

  getProfile: async function (email: string): Promise<IUser> {
    let allowed = ['favor.reviews', 'favor.title', 'favor.description', 'favor.location', 'name', 'email', 'phone'];
    let user: IUser = await User.findOne({email}).select(allowed).exec();
    if (!user) throw new Error(`User not found`);
    return user;
  },

  signup: async function (userInfo: IUserInfo, favorInfo: IFavor, latitude: Number, longitude: Number): Promise<{ result: IUser; tokens: ITokens; favor: IFavor}> {
    if (!userInfo.password) throw new Error(`Password is required`);
    userInfo.password = bcrypt.hashSync(userInfo.password, bcrypt.genSaltSync(10));

    userInfo.favor = favorInfo;

    let user: IUser = new User(userInfo);
    if (!user) throw new Error(`Error creating user`);

    console.log("user: ", user);

    let result: IUser = await user.save();
    if (!result) throw new Error(`Error saving user`);

    // TODO: Uncomment these lines in production
    //let chat: IChatUser = await this.loginChat(user);
    //if (!chat) throw new Error("Error login match");
    let chat = {secret: "a"};

    let tokens: ITokens = jwtService.generate(result._id, result.email, false, chat.secret);
    if (!tokens) throw new Error(`Error generating tokens`);

    return { result, tokens, favor: result.favor };
  },

  login: async function (info: IUserInfo): Promise<{ user: IUser; tokens: ITokens, favor: string}> {
    const { email, password } = info;

    let user: IUser = await User.findOne({ email });
    if (!user) throw new Error(`Invalid credentials`);

    let validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error(`Invalid credentials`);

    // TODO: Uncomment these lines in production
    //let chat = await this.loginChat(user);
    //if (!chat) throw new Error("Error login match");
    let chat = {secret: "a"};

    let favor: IFavor = user.favor;
    if (!favor) throw new Error(`Error finding favor`);

    let tokens: ITokens = jwtService.generate(user._id, user.email, user.admin, chat.secret);

    return { user, tokens,  favor: favor.favor_state};
  },

  loginChat: async function (info: IUser): Promise<IChatUser> {
    try {
      let r = await axios.put('https://api.chatengine.io/users/',
        { username: info.email, secret: info._id, first_name: info.name },
        { headers: { "Private-Key": process.env.CHATENGINE_PRIVATE_KEY } }
      );
      return r.data;
    } catch (error) {
      throw new Error(`Error creating chat user. ${error.name}: ${error.message}`);
    }
  },

  logout: async function (): Promise<ITokens> {
    return jwtService.logout();
  },

  refresh: async function (info: { body: { refreshtoken: string } }): Promise<string> {
    var refreshToken = info.body.refreshtoken;
    if (!refreshToken) throw new Error(`Refresh token is required`);

    let payload = await jwtService.verify(refreshToken, process.env.JWT_REFRESH as string);
    if (!payload) throw new Error(`Invalid refresh token`);

    // TODO: Uncomment these lines in production
    //let chat = await this.loginChat(<IUser>payload);
    //if (!chat) throw new Error("Error login match");
    let chat = {secret: "a"};

    var accessToken = jwtService.generate(payload.id, payload.email, payload.admin, chat.secret).access;
    if (!accessToken) throw new Error(`Error generating access token`);
    
    return accessToken;
  },

  updateUserProfileInfo: async function (userId: ObjectId, newUserData: Partial<IUser>, latitude: Number, longitude: Number): Promise<IUser> {
    // Campos permitidos para actualización
    const allowedFields = ['name', 'phone', 'age', 'favor.title', 'favor.description', 'favor.location', 'favor.category'];
    // Filtrar el objeto newUserData para permitir sólo los campos permitidos
    const filteredUserData = _.pick(newUserData, allowedFields);
    console.log("filteredUserData: ", filteredUserData);

    // Buscar y actualizar el usuario en la base de datos, newUserData es un objeto con los elementos a actualizar.
    const updateUser: IUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUserData }, // Utilizar el operador $set para actualizar sólo los campos permitidos
      { new: true } // Para obtener el objeto actualizado en la respuesta
    ).select('-password -admin').exec();

    // Comprobar si se encontró y actualizó el usuario
    if (!updateUser) throw new Error("Usuario no encontrado"); // Lanza un error si no se encontró el usuario

    // Retornar el usuario actualizado
    return updateUser;
  },

  deleteUser: async function (userId: ObjectId): Promise<IUser> {
    const deletedUser: IUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) throw new Error("Usuario not found"); // Lanza un error si no se encontró el usuario

    return deletedUser;
  },
  createReport: async function (reportData: IUserReport): Promise<IUserReport> {
    let report: IUserReport = new UserReport(reportData);
    if (!report) throw new Error(`Error creating report`);
    if(report.reporterId.toString()==report.reportedId.toString()) throw new Error("Can't report yourself");

    let result: IUserReport = await report.save();
    if (!result) throw new Error(`Error saving report`);
    console.log("REPORT: ", report);

    return result;
  },
  suscribe: async function(info){
    if(!info) throw new Error(`No info given`);
    let result = await Subscription.findOneAndUpdate({userId: info.userId}, info).exec();
    if(!result) result = await Subscription.create(info);
    console.log("Suscribed");
    return await Subscription.findOne({userId: info.userId}).exec();
  },
  getMatches: async function(id, option){
    if(!id) throw new Error('No id given');
    let matches = [];
    let status: any = "COMPLETED";
    if(option != 'COMPLETED') status = {$ne: "COMPLETED"}
    try {
      matches = await MatchService.getFinishedMatches(id, status);
    }catch(error) { throw new Error(error); }

    return matches;
  }
}

export default userService;
