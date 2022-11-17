import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";
import {IUserInfo} from "./IUserInfo";

export interface IRegisterModel {
    login: string
    email: string
    nickname: string
    name: string
    surname: string
    password: string
    confirmPassword: string
    userInfo: IUserInfo
    role: string
}
