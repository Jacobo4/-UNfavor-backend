export interface IUserInfo {
  email: string;
  password: string;
  [key: string]: any;
}

export interface IChatUser {
  username: string;
  secret: string;
  first_name: string;
}

export interface ITokens {
    access: string;
    refresh: string;
}

