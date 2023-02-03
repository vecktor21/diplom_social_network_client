import {IAttachment} from "./IAttachment";
import {IUser} from "./IUser";

export interface IMessage {
    messageId: number,
    chatRoomId: number,
    text: string,
    messageAttachments: IAttachment[],
    sendingTime: Date,
    sender: IUser
}