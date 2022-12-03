import api from "./AxiosService";
import {ILike} from "../types/ILike";

export default class Class {
    //поставить\убрать лайк на посте
    static async LikePost(userId: number, isLiked: boolean, postId: number){
        await api.post("https://localhost:7021/api/Like/post",{
            userId,
            isLiked,
            postId
        })
    }
    //поставить\убрать лайк на коммента
    static async LikeComment(userId: number, isLiked: boolean, commentId: number){
        await api.post("https://localhost:7021/api/Like/comment",{
            userId,
            isLiked,
            commentId
        })
    }

    //дополнительный функционал
    //проверка: лайкнул ли текущий пользователь что-либо
    static IsLiked(userId: number | undefined,likes: ILike[]):boolean{
        if(userId == undefined){
            return false
        }
        if(likes.filter(x=>x.likedUserId==userId).length==0){
            return false
        }
        return true
    }

}