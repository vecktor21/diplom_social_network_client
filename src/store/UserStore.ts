import {IUser} from "../types/IUser";
import {makeAutoObservable} from "mobx";
import {IUserInfo} from "../types/IUserInfo";
import {IUserInfoPrivacyType} from "../types/IUserInfoPrivacyType";
import {ICountry} from "../types/ICountry";

export default class UserStore {
    //затычка:
    /*_user = {
        userId: 1,
        name: "denis",
        surname: "odnourov",
        nickname: "vecktor",
        login: "somelogin",
        role: "ADMIN",
        profileImage: "./src/Placeholders/imgPlaceholder.png"
    } as IUser */

    _user = {} as IUser
    _userInfo = {} as IUserInfo
    /* _userInfo = {
        Age: 20,
        DateOfBirth: "26-12-2001",
        City: "Нур-Султан",
        Country: {
            CountryNameEn: "Kaz",
            CountryNameRu: "Каз",
        }as ICountry,
        Status: "какая-то пацанская циатата ауф",
        Education: "ЕНУ им Л.Н. Гумилева",
        UserInfoPrivacyType: {
            UserInfoPrivacyTypeName: "PublicPage"
        } as IUserInfoPrivacyType
    } as IUserInfo */

    _isAuth = false

    _isLoading = false

    constructor() {
        makeAutoObservable(this)
    }
    setIsAuth(bool: boolean){
        this._isAuth = bool
    }
    get isAuth(){
        return this._isAuth
    }
    setUser(user: IUser){
        this._user = user
    }
    get UserInfo(){
        return this._userInfo
    }
    setUserInfo(userInfo: IUserInfo){
        this._userInfo = userInfo
    }
    get user(){
        return this._user
    }
    Login(user: IUser){
        this.setUser(user)
        this.setIsAuth(true)
    }
    Logout(){
        this.setUser({} as IUser)
        this.setUserInfo({} as IUserInfo)
        this.setIsAuth(false)
        console.log("UserStore выход")
    }
    get isLoading(){
        return this._isLoading
    }
    setIsLoading(b:boolean){
        this._isLoading=b
    }
}