import api from "./AxiosService";
import {IArticle} from "../types/IArticle";
import {IGroup} from "../types/IGroup";
import {IFavoritePost} from "../types/IFavoritePost";
import {GlobalService} from "./GlobalService";

export default class FavoriteService{
    static async GetFavoriteGroups(userId:number){
        const res = await api.get<IGroup[]>("/api/Favorite?type=0&userId="+userId)
        return res.data
    }
    static async GetFavoriteArticles(userId:number){
        const res = await api.get<IArticle[]>("/api/Favorite?type=1&userId="+userId)
        return res.data
    }
    static async GetFavoritePosts(userId:number){
        const res = await api.get<IFavoritePost[]>("/api/Favorite?type=2&userId="+userId)
        res.data.forEach(post=>{
            post.publicationDate = GlobalService.JsonDateStringToDateObj(post.publicationDate)
        })
        return res.data
    }
}
