import {IPost} from "../types/IPost";
import {IAuthorInfo} from "../types/IAuthorInfo";
import {IComment} from "../types/IComment";
import React, {ReactNode} from "react";
import CommentComponent from "../components/CommentComponent";
import api from "./AxiosService";
import {GlobalService} from "./GlobalService";
import {IPostCreateViewModel} from "../types/IPostCreateViewModel";

export default class PostService{
    //посты пользователей
    static async GetUserPost(userId: number) {
        const result = await api.get<IPost>(`/api/Post/user/${userId}`)
        result.data.publicationDate = GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
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
    static async CreateUserPost(newPost: IPostCreateViewModel){
        await api.post("/api/Post/User/createUserPost", newPost)
    }
    static async DeleteUserPost(postId: number){
         return await api.delete(`/api/Post/user/DeleteUserPost?postId=${postId}`)
    }


    //посты групп
    static async GetGroupPost(groupId: number) {
        const result = await api.get<IPost>(`/api/Post/group/${groupId}`)
        result.data.publicationDate = GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
    }
    static async GetGroupPosts(groupId: number){
        const result = await api.get<IPost[]>(`/api/Post/group/GetGroupPosts/${groupId}`)
        result.data.forEach(post=>{
            post.publicationDate = GlobalService.JsonDateStringToDateObj(post.publicationDate)
        })
        return result
    }
    static async CreateGroupPost(newPost: IPostCreateViewModel){
        await api.post("/api/Post/Group/CreateGroupPost", newPost)
    }
    static async DeleteGroupPost(postId: number){
        return await api.delete(`/api/Post/group/DeleteGroupPost?postId=${postId}`)
    }


    //вспомогательные методы
    static IterateComments(comment: IComment) : ReactNode[] {
        if(comment.replies.length == 0){
            return [<CommentComponent key={comment.commentId} comment={comment}/>]
        }
        let commentNodes = [
            <CommentComponent comment={comment} key={comment.commentId}/>
        ] as ReactNode[]
        for(let i = 0; i < comment.replies.length; i++){
            commentNodes.push(
                <div key={comment.commentId * new Date().getMilliseconds()}>
                    {
                        PostService.IterateComments(comment.replies[i])
                            .map(node=>
                                node
                            )
                    }
                </div>
            )
        }return commentNodes
    }



}