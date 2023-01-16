import {IAttachment} from "./IAttachment";
import {IUser} from "./IUser";

export interface IMessage {
    messageId: number,
    chatRoomId: number,
    message: string,
    attachments: IAttachment[],
    publicationDate: Date,
    sender: IUser
}