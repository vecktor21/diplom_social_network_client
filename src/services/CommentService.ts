import {IPostCommentCreateModel} from "../types/IPostCommentCreateModel";
import api from "./AxiosService";
import {ICommentUpdateModel} from "../types/ICommentUpdateModel";
import {IArticleCommentCreateModel} from "../types/IArticleCommentCreateModel";
import {IArticlePageCommentCreateModel} from "../types/IArticlePageCommentCreateModel";

export class CommentService {

    //комментарии к посту
    //создает комментарий для поста
    static async CreatePostComment(newComment: IPostCommentCreateModel){
        return await api.post("/api/Comment/CreatePostComment", newComment)
    }

    //комментарии к статье
    //создает комментарий для статьи
    static async CreateArticleComment(newComment: IArticleCommentCreateModel){
        return await api.post("/api/Comment/CreateArticleComment", newComment)
    }

    //комментарии к странице статьи
    static async CreateArticlePageComment(newComment: IArticlePageCommentCreateModel){
        return await api.post("/api/Comment/CreateArticlePageComment", newComment)
    }

    //универсальные действия (выполняются в не зависимости, к какому комменту обращается)
    //удаляет любой коммент
    static async DeleteComment(commentId: number){
        return await api.delete(`/api/Comment?commentId=${commentId}`)
    }

    //создает ответ на комментарий
    //создает ответ для любого комментария (не только для коммента к посту)
    static async ReplyToComment(commentId: number, newComment: IPostCommentCreateModel){
        return await api.post(`/api/Comment/ReplyToComment/${commentId}`, newComment)
    }
    //изменить коммент
    static async ChangeComment(newComment: ICommentUpdateModel){
        return await api.post(`/api/Comment/UpdateComment`, newComment)
    }
}