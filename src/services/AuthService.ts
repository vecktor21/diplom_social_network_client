import {IRegisterModel} from "../types/IRegisterModel";
import api from './AxiosService'
import {AxiosResponse} from "axios";
import {IAuthResponse} from "../types/IAuthResponse";
import {ILoginModel} from "../types/ILoginModel";
import UserStore from "../store/UserStore";
export default class AuthService {
    static async Register(user: IRegisterModel) : Promise<AxiosResponse<IAuthResponse>>{
        const response = await api.post<IAuthResponse>("/api/account/register", user)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userId", response.data.user.userId.toString())
        return response
    }
    static async Login(user: ILoginModel) : Promise<AxiosResponse<IAuthResponse>>{
        const response = await api.post<IAuthResponse>("/api/account/login", user)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userId", response.data.user.userId.toString())
        return response
    }
    static async Logout() : Promise<AxiosResponse>{
        let userId = localStorage.getItem("userId")
        const response = await api.get(`/api/account/logout?userId=${userId}`)
        if(response.status==200){
            console.log("вы вышли")
        }
        localStorage.setItem("userId", "")
        localStorage.setItem("token", "")
        return response
    }
    static async CheckAuth() : Promise<AxiosResponse<IAuthResponse>>{
        let userId = localStorage.getItem("userId")
        const response = await api.get(`/api/account/checkauth?userId=${userId}`)

        if(response.status){
            if(response.status == 200){
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("userId", response.data.user.userId.toString())
            }else{
                localStorage.setItem("token", "")
                localStorage.setItem("userId", "")
            }
        }

        return response
    }
}