import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";

export interface IUserInfo {
    userInfoId: number,
    userId: number,
    age: number,
    dateOfBirth: Date,
    city: string,
    country: ICountry,
    status: string,
    education: string,
    userInfoPrivacyType: IUserInfoPrivacyType
}