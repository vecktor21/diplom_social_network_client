import {IRegisterModel} from "./IRegisterModel";
import {IUserInfo} from "./IUserInfo";
import {ICountry} from "./ICountry";
import {IUserInfoPrivacyType} from "./IUserInfoPrivacyType";

export class RegisterModel implements IRegisterModel {
    login = ""
    email = ""
    nickname = ""
    name = ""
    surname = ""
    password = ""
    confirmPassword = ""
    userInfo = {
        age: 0,
        dateOfBirth: "",
        city: "",
        country: {
            countryID : 1,
            countryNameEn:"",
            countryNameRu:""
        },
        status: "",
        education: "",
        userInfoPrivacyType: {
            userInfoPrivacyTypeId : 0,
            userInfoPrivacyTypeName: "PublicPage"
        }
    }
    role = "USER"


}
