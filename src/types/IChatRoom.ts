import {IMessage} from "./IMessage";
import {IUser} from "./IUser";

export interface IChatRoom {
    chatRoomId: number,
    chatRoomTypeId: number,
    chatRoomType: string,
    chatRoomImage: string,
    chatRoomName: string,
    lastMessage: IMessage,
    messages: IMessage[],
    members: IUser[],
    chatRoomAdminId: number
}