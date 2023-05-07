import bcrypt from 'bcrypt';
import jwtService from '../authenticate/jwt.service';
import User, { IUser } from './user.model';
import Favor, { IFavor } from '../favor/favor.model';
import { _ } from "lodash";
import axios from 'axios';

interface IUserInfo {
  email: string;
  password: string;
  [key: string]: any;
}

interface IChatUser {
  username: string;
  secret: string;
  first_name: string;
}

interface IJWTService {
  generate: (id: string, email: string, admin?: boolean) => { access: string; refresh: string };
  verify: (token: string, secret: string) => Promise<any>;
  logout: () => { access: string; refresh: string };
}

const userService = {
  getUserInfo: async function (userId: string): Promise<IUser> {
    let user = await User.findById(userId).select('-password').exec();
    if (!user) throw new Error(`User not found`);
    return user;
  },
  signup: async function (info: IUserInfo): Promise<{ result: IUser; tokens: { access: string; refresh: string } }> {
    if (!info.password) throw new Error(`Password is required`);
    info.password = bcrypt.hashSync(info.password, bcrypt.genSaltSync(10));

    var user = new User(info);
    if (!user) throw new Error(`Error creating user`);

    var result = await user.save();
    if (!result) throw new Error(`Error saving user`);

    let chat = await this.loginChat(user);
    if (!chat) throw new Error("Error login chat");

    var tokens = jwtService.generate(result._id, result.email, false);
    if (!tokens) throw new Error(`Error generating tokens`);

    return { result, tokens };
  },
  login: async function (info: IUserInfo): Promise<{ user: IUser; tokens: { access: string; refresh: string }; chat: any }> {
    const { email, password } = info;
    var user = await User.findOne({ email });
    if (!user) throw new Error(`Invalid credentials`);

    var validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error(`Invalid credentials`);

    let chat = await this.loginChat(user);
    if (!chat) throw new Error("Error login chat");

    var tokens = jwtService.generate(user._id, user.email, user.admin);
    return { user, tokens, chat };
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
  logout: async function (): Promise<{ access: string; refresh: string }> {
    return jwtService.logout();
  },
  refresh: async function (info: { body: { refreshtoken: string } }): Promise<string> {
    var refreshToken = info.body.refreshtoken;
    if (!refreshToken) throw new Error(`Refresh token is required`);

    let payload = await jwtService.verify(refreshToken, process.env.JWT_REFRESH as string);
    if (!payload) throw new Error(`Invalid refresh token`);

    var accessToken = jwtService.generate(payload.id, payload.email, payload.admin).access;
    if (!accessToken) throw new Error(`Error generating access token`);
    return accessToken;
  },
  createFavor: async function (favorData: IFavor): Promise<IFavor> {
    let favor = new Favor(favorData);
    console.log("FAVOR: ", favor);
    if (!favor) throw new Error(`Error creating favor`);

    let result = await favor.save();
    if (!result) throw new Error(`Error saving favor`);

    return result;
  },
  updateUserProfileInfo: async function (userId: string, newUserData: Partial<IUser>): Promise<IUser> {
    // Campos permitidos para actualización
    const allowedFields = ['name', 'phone', 'age', 'favor.title', 'favor.description', 'favor.location'];

    // Filtrar el objeto newUserData para permitir sólo los campos permitidos
    const filteredUserData = _.pick(newUserData, allowedFields);
    console.log("filteredUserData: ", filteredUserData);
    // Buscar y actualizar el usuario en la base de datos, newUserData es un objeto con los elementos a actualizar.
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUserData }, // Utilizar el operador $set para actualizar sólo los campos permitidos
      { new: true } // Para obtener el objeto actualizado en la respuesta
    ).select('-password -admin').exec();

    // Comprobar si se encontró y actualizó el usuario
    if (!updateUser) {
      throw new Error("Usuario no encontrado"); // Lanza un error si no se encontró el usuario
    }

    // Retornar el usuario actualizado
    return updateUser;
  },
  deleteUser: async function (userId: string): Promise<IUser> {
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      throw new Error("Usuario not found"); // Lanza un error si no se encontró el usuario
    }
    return deletedUser;
  }
}

export default userService;