import api from "./AxiosService";
import {ILike} from "../types/ILike";
import consts from "../consts";

export default class Class {
    //поставить\убрать лайк на посте
    static async LikePost(userId: number, isLiked: boolean, postId: number){
        await api.post(consts.API_URL +"/api/Like/post",{
            userId,
            isLiked,
            postId
        })
    }
    //поставить\убрать лайк на коммента
    static async LikeComment(userId: number, isLiked: boolean, commentId: number){
        await api.post(consts.API_URL +"/api/Like/comment",{
            userId,
            isLiked,
            commentId
        })
    }

    //поставить\убрать лайк статью
    static async LikeArticle(userId: number, isLiked: boolean, articleId: number){
        await api.post(consts.API_URL + "/api/Like/article",{
            userId,
            isLiked,
            articleId
        })
    }

    //поставить\убрать лайк на страницу статьи
    static async LikeArticlePage(userId: number, isLiked: boolean, articlePageId: number){
        await api.post(consts.API_URL + "/api/Like/articlepage",{
            userId,
            isLiked,
            articlePageId
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