import api from "./AxiosService";
import {IBannedUser} from "../types/IBannedUser";
import {GlobalService} from "./GlobalService";
import articlePageUpdatePage from "../components/Pages/ArticlePageUpdatePage";

export class BanService{
    //получить черный список пользователя
    static async GetUserBans(userId:number){
        const res = await api.get<IBannedUser[]>("/api/Block/user?userId="+userId)
        res.data.forEach(u=>{
            u.dateFrom=GlobalService.JsonDateStringToDateObj(u.dateFrom)
            u.dateTo=GlobalService.JsonDateStringToDateObj(u.dateTo)
        })
        console.log(res.status)
        return res.data
    }
    //удалить из черного списка пользователя
    static async RemoveFromUserBlockList(userId:number, blockUserId:number){
        const res = await api.delete(`/api/Block/user?userId=${userId}&blockUserId=${blockUserId}`)
        console.log(res.status)
        return res
    }
    //забанить пользователя
    static async BanUser(blockedUserId:number,userId:number,reason:string|null, dateTo:Date|null){
        const res = await  api.put("/api/Block/user", {
            blockedUserId, userId, reason
        })
        return res
    }
    //забанить пользователя в группе
    static async GroupBanUser(blockedUserId:number,groupId:number,reason:string|null, dateTo:Date|null){
        const res = await  api.put("/api/Block/group", {
            blockedUserId, groupId, reason
        })
        return res
    }
    //получить черный список группы
    static async GetGroupBans(groupId:number){
        const res = await api.get<IBannedUser[]>("/api/Block/group?groupId="+groupId)
        res.data.forEach(u=>{
            u.dateFrom=GlobalService.JsonDateStringToDateObj(u.dateFrom)
            u.dateTo=GlobalService.JsonDateStringToDateObj(u.dateTo)
        })
        console.log(res.status)
        return res.data
    }
    //удалить из черного списка группы
    static async RemoveFromGroupBlockList(groupId:number, blockUserId:number){
        const res = await api.delete(`/api/Block/group?groupId=${groupId}&blockUserId=${blockUserId}`)
        console.log(res.status)
        return res
    }
}
