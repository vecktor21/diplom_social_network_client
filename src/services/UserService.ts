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

export default class UserService {
    static async GetUser(userId: number){
        const response = await api.get<IUser>("/api/user?userId="+userId)
        return response.data
    }
    static GetUserInfo(userId: number, currentUserId: number) : IUserInfo{
        return {
            age: 20,
            dateOfBirth: "26-12-2001",
            city: "Нур-Султан",
            country: {
                countryNameEn: "Kaz",
                countryNameRu: "Каз",
            }as ICountry,
            status: "какая-то пацанская циатата ауф",
            education: "ЕНУ им Л.Н. Гумилева",
            userInfoPrivacyType: {
                userInfoPrivacyTypeName: "PublicPage"
            } as IUserInfoPrivacyType
        } as IUserInfo
    }

    static GetBanList(userId: number) : IBannedUser[]{
        return [
            {
                banUserId: 11,
                name: "жук",
                surname: "павук",
                nickname: "kopeshylu",
                profileImage: "./src/Placeholders/imgPlaceholder.png"
            },
            {
                banUserId: 10,
                name: "жук",
                surname: "павук",
                nickname: "kopeshylu",
                profileImage: "./src/Placeholders/imgPlaceholder.png"
            },
            {
                banUserId: 12,
                name: "жук",
                surname: "павук",
                nickname: "kopeshylu",
                profileImage: "./src/Placeholders/imgPlaceholder.png"
            },
        ]
    }

    static async GetUserLinkedPosts(userId: number) {
        const result = await api.get<IPost[]>(`/api/Post/GetUserLinkedPosts/${userId}`)
        result.data.forEach(post=>{
            post.publicationDate = GlobalService.JsonDateStringToDateObj(post.publicationDate)
        })
        return result
    }


    static async GetUserPosts(userId: number) {
        const result = await api.get<IPost[]>(`/api/Post/user/GetUserPosts/${userId}`)
        result.data.forEach(post=>{
            post.publicationDate = GlobalService.JsonDateStringToDateObj(post.publicationDate)
        })
        return result
    }



    static async GetUserGroups(userId: number){
        return await api.get<IGroup[]>(`${consts.API_URL}/api/Group/getUserGroups/${userId}`);
    }




    static GetFavorites(userId:number):IFavorite[]{
        return [
            {
                ObjectType: "Article",
                FavoriteId: 31,
                ObjectId: Math.floor(Math.random()*3),
                UserId: userId
            }
        ]
    }
    static async GetUsers(): Promise<AxiosResponse<IUser[]>>{
        const response = await api.get("/api/user/users")
        return response
    }
    //todo
    static Like(userId:number,objectId:number, objectType:ObjectTypes){

    }
    //todo
    static AddToFavorites(userId:number,objectId:number, objectType:ObjectTypes){

    }
}