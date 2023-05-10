import {Axios, AxiosResponse} from "axios";
import {IUser} from "../types/IUser";
import {IUserInfo} from "../types/IUserInfo";
import {IFriend} from "../types/IFriend";
import {IBannedUser} from "../types/IBannedUser";
import {IFile} from "../types/IFile";
import {IPost} from "../types/IPost";
import {IAttachment} from "../types/IAttachment";
import {ILike} from "../types/ILike";
import PostService from "./PostService";
import {IGroup} from "../types/IGroup";
import GroupService from "./GroupService";
import {IFavorite} from "../types/IFavorite";
import {ObjectTypes} from "../types/ObjectTypes";
import {ICountry} from "../types/ICountry";
import {IUserInfoPrivacyType} from "../types/IUserInfoPrivacyType";
import api from "./AxiosService";
import consts from "../consts";
import {GlobalService} from "./GlobalService";
import {PaginatedResponse} from "../types/PaginatedResponse";
import {UserShortViewModel} from "../types/UserShortViewModel";

export default class UserService {
    static async GetUser(userId: number){
        const response = await api.get<IUser>("/api/user?userId="+userId)
        return response.data
    }
    static async GetUserInfo(userId: number, currentUserId: number) {
        const response = await api.get<IUserInfo>("/api/User/GetUserInfo/"+userId + "?currentUserId="+currentUserId);
        response.data.dateOfBirth=GlobalService.JsonDateStringToDateObj(response.data.dateOfBirth)
        return  response.data
    }
    static async CheckIsAllowed(targetUser:number, currentUser:number){
        const res = await api.get<boolean>(`/api/User/IsAllowed?targetUserId=${targetUser}&currentUserId=${currentUser}`)
        return res
    }

    static async ChangeUserInfo(userInfo: IUserInfo){
        const res = await api.post("/api/User/ChangeUserInfo", userInfo)
        console.log(res.data)
        console.log(res.status)
        console.log(res.headers)
    }
    static async ChangeUser(user: IUser){
        const res = await api.post("/api/User/ChangeUser", user)
        console.log(res.data)
        console.log(res.status)
        console.log(res.headers)
    }

    static async ChangeProfileImage(userId: number, newImageId: number){
        const res = await api.post(`/api/User/ChangeUserProfileImage?userId=${userId}&newImageId=${newImageId}`)
        console.log(res.data)
        console.log(res.status)
        console.log(res.headers)
    }



    static async GetUserGroups(userId: number){
        return await api.get<IGroup[]>(`${consts.API_URL}/api/Group/getUserGroups/${userId}`);
    }

    static async SaveRoleStatusChanges(userId:number, role:string, status:string ){
        console.log(userId, role, status)
        api.post(`${consts.API_URL}/api/User/SaveChanges?userId=${userId}&role=${role}&status=${status}`);
    }

    static async GetUsers(){
        const response = await api.get<IUser[]>("/api/user/users")
        response.data.forEach(u=>{
            u.statusFrom = GlobalService.JsonDateStringToDateObj(u.statusFrom)
        })
        return response
    }

    static async FindUsers(searchString:string, page?:number,take?:number){
        if(page!=undefined&&take!=undefined){
            const response = await api.get<PaginatedResponse<UserShortViewModel>>(`/api/user/FindUsers?searchString=${searchString}&page=${page}&take=${take}`)
            return response
        }else{
            const response = await api.get<PaginatedResponse<UserShortViewModel>>(`/api/user/FindUsers?searchString=${searchString}`)
            return response
        }
    }
}
