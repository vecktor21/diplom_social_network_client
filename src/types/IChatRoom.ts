import {IMessage} from "./IMessage";
import {IUser} from "./IUser";

export interface IChatRoom {
    chatRoomId: number,
    chatRoomType: string,
    chatRoomName: string,
    lastMessage: IMessage,
    chatRoomMembers: IUser[]
}