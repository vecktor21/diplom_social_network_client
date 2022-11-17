import {IAttachment} from "./IAttachment";
import {ILike} from "./ILike";
import {IComment} from "./IComment";
import {text} from "stream/consumers";
import {IAuthorInfo} from "./IAuthorInfo";

export interface IPost {
    postId: number,
    title: string,
    text: string,
    postAttachments: IAttachment[],
    likes: ILike[],
    comments: IComment[],
    author: IAuthorInfo,
    publicationDate: Date,
    postType: string
}