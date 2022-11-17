import {IRegisterModel} from "./IRegisterModel";
import {IUserInfo} from "./IUserInfo";
import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";

export class RegisterModel implements IRegisterModel {
    login = "test"
    email = "test@mail.ru"
    nickname = "test"
    name = "test"
    surname = "test"
    password = "123456"
    confirmPassword = "123456"
    userInfo = {
        age: 1,
        dateOfBirth: "",
        city: "test",
        country: {
            countryID : 1,
            countryNameEn:"",
            countryNameRu:""
        },
        status: "test",
        education: "test",
        userInfoPrivacyType: {
            userInfoPrivacyTypeId : 0,
            userInfoPrivacyTypeName: "PublicPage"
        }
    }
    role = "USER"


}