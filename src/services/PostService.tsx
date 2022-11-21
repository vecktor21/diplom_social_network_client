import {IPost} from "../types/IPost";
import {IAuthorInfo} from "../types/IAuthorInfo";
import {IComment} from "../types/IComment";
import React, {ReactNode} from "react";
import CommentComponent from "../components/CommentComponent";
import api from "./AxiosService";
import {GlobalService} from "./GlobalService";

export default class PostService{

    static async GetUserPost(userId: number) {
        const result = await api.get<IPost>(`/api/Post/user/${userId}`)
        result.data.publicationDate = GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
    }

    static async GetGroupPost(groupId: number) {
        const result = await api.get<IPost>(`/api/Post/group/${groupId}`)
        result.data.publicationDate = GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
    }

    static IterateComments(comment: IComment) : ReactNode {
        if(comment.replies.length == 0){
            return <CommentComponent key={comment.commentId} comment={comment}/>
        }
        for(let i = 0; i < comment.replies.length; i++){
            return (
                <div key={comment.commentId}>
                    <CommentComponent comment={comment}/>
            {PostService.IterateComments(comment.replies[i])}
            </div>
        )
        }
    }



}