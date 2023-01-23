import {IChatRoom} from "../types/IChatRoom";
import {IUser} from "../types/IUser";
import api from "./AxiosService";
import {IMessage} from "../types/IMessage";

export class MessengerService {
    //получает все чаты пользователя
    static async GetUserChatRooms(userId: number){
        const res = await api.get<IChatRoom[]>("/api/Messenger/GetUserChatRooms/"+userId)
        return res
    }
    //получает информацию о чате
    static async GetChatRoom(chatRoomId: number){
        const res = await api.get<IChatRoom>("/api/Messenger/GetChatRoom/"+chatRoomId)
        return res
    }
}