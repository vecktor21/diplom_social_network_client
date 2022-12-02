import {ICommentCreateModel} from "../types/ICommentCreateModel";
import api from "./AxiosService";
import {ICommentUpdateModel} from "../types/ICommentUpdateModel";

export class CommentService {

    //комментарии к посту
    //создает комментарий для поста
    static async CreatePostComment(newComment: ICommentCreateModel){
        return await api.post("/api/Comment/CreatePostComment", newComment)
    }



    //универсальные действия (выполняются в не зависимости, к какому комменту обращается)
    //удаляет любой коммент
    static async DeleteComment(commentId: number){
        return await api.delete(`/api/Comment?commentId=${commentId}`)
    }

    //создает ответ на комментарий
    //создает ответ для любого комментария (не только для коммента к посту)
    static async ReplyToComment(commentId: number, newComment: ICommentCreateModel){
        return await api.post(`/api/Comment/ReplyToComment/${commentId}`, newComment)
    }
    //изменить коммент
    static async ChangeComment(newComment: ICommentUpdateModel){
        return await api.post(`/api/Comment/UpdateComment`, newComment)
    }
}