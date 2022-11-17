import axios, { AxiosError } from 'axios'
import consts from '../consts'
import { IAuthResponse } from '../types/IAuthResponse'

const api = axios.create({
    baseURL: consts.API_URL,
    withCredentials: true
})

api.interceptors.request.use(config=>{
    // @ts-ignore
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`
    // @ts-ignore
    //config.headers["Access-Control-Allow-Origin"] = true;
    return config
},    function (error) {
        // Do something with request error
        return Promise.reject(error)
    })

api.interceptors.response.use(config=>{
    return config
}, async(error : AxiosError)=>{
    const originalReq = error.config
    // @ts-ignore
    if(error.response?.status==401 && error.config && !error._isRetry){
        // @ts-ignore
        originalReq._isRetry = true;
        try{
            const response = await api.get<IAuthResponse>(`/api/account/checkauth?userId=${localStorage.getItem("userId")}`)
            localStorage.setItem("userId", response.data.user.userId.toString())
            localStorage.setItem("token", response.data.token)
            return api.request(originalReq)
        }catch(e){
            console.log("пользователь не автоизован")
        }
    }
})
export default  api