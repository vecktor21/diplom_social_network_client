import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";

export interface IUserInfoCreateModel {
    age: number,
    dateOfBirth: string,
    city: string,
    country: ICountry,
    status: string,
    education: string,
    userInfoPrivacyType: IUserInfoPrivacyType
}