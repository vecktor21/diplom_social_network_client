import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";
import {IUserInfo} from "./IUserInfo";
import {IUserInfoCreateModel} from "./IUserInfoCreateModel";

export interface IRegisterModel {
    login: string
    email: string
    nickname: string
    name: string
    surname: string
    password: string
    confirmPassword: string
    userInfo: IUserInfoCreateModel
    role: string
}
