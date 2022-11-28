import {IAttachment} from "./IAttachment";
import {ILike} from "./ILike";

export interface IComment {
    commentId: number
    userId: number,
    userName: string,
    profileImage: string,
    message: string,
    objectId: number,
    objectName: string,
    attachment: IAttachment,
    likes: ILike[],
    replies: IComment[],
    isReply: boolean,
    isDeleted: boolean
}