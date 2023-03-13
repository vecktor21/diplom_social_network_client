import api from "./AxiosService";
import {IArticle} from "../types/IArticle";
import {IGroup} from "../types/IGroup";
import {IFavoritePost} from "../types/IFavoritePost";
import {GlobalService} from "./GlobalService";
import {FavoriteType} from "../types/FavoriteType";

export default class FavoriteService{
    static async GetFavoriteGroups(userId:number){
        const res = await api.get<IGroup[]>("/api/Favorite?type=0&userId="+userId)
        return res.data
    }
    static async IsFavorite(userId:number, itemId:number,type:FavoriteType){
        const res = await api.get<boolean>(`/api/Favorite/IsFavorite?type=${type}&userId=${userId}&itemId=${itemId}`)
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
    static async SetFavoritePost(userId:number,postId:number){
        const res = await api.put(`/api/Favorite/post?postId=${postId}&userId=${userId}`)
    }
    static async SetFavoriteGroup(userId:number,groupId:number){
        const res = await api.put(`/api/Favorite/group?groupId=${groupId}&userId=${userId}`)
    }
    static async SetFavoriteArticle(userId:number,articleId:number){
        const res = await api.put(`/api/Favorite/article?articleId=${articleId}&userId=${userId}`)
    }
    static async RemoveFavoritePost(userId:number,postId:number){
        const res = await api.delete(`/api/Favorite/post?postId=${postId}&userId=${userId}`)
    }
    static async RemoveFavoriteGroup(userId:number,groupId:number){
        const res = await api.delete(`/api/Favorite/group?groupId=${groupId}&userId=${userId}`)
    }
    static async RemoveFavoriteArticle(userId:number,articleId:number){
        const res = await api.delete(`/api/Favorite/article?articleId=${articleId}&userId=${userId}`)
    }
}
