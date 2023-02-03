import {IChatRoom} from "../types/IChatRoom";
import {IUser} from "../types/IUser";
import api from "./AxiosService";
import {IMessage} from "../types/IMessage";
import {GlobalService} from "./GlobalService";
import {ICreateChatRoomModel} from "../types/ICreateChatRoomModel";

export class MessengerService {
    //получает все чаты пользователя
    static async GetUserChatRooms(userId: number){
        const res = await api.get<IChatRoom[]>("/api/Messenger/GetUserChatRooms/"+userId)
        res.data.forEach(chatRoom=>{
            if (chatRoom.messages.length>0){
                chatRoom.messages.forEach(mess=>{
                    if(mess.sendingTime){
                        mess.sendingTime = GlobalService.JsonDateStringToDateObj(mess.sendingTime)
                    }

                })
            }
            if (chatRoom?.lastMessage?.sendingTime){
                chatRoom.lastMessage.sendingTime = GlobalService.JsonDateStringToDateObj(chatRoom.lastMessage.sendingTime)
            }
        })

        return res
    }

    static async CreateChatRoom(newChatRoom:ICreateChatRoomModel){
        const res = await api.post("/api/Messenger/CreateChatRoom", newChatRoom)
        return res
    }

    //получает информацию о чате
    static async GetChatRoom(chatRoomId: number){
        const res = await api.get<IChatRoom>("/api/Messenger/GetChatRoom/"+chatRoomId)
        res.data.messages.forEach(mess=>{
            mess.sendingTime = GlobalService.JsonDateStringToDateObj(mess.sendingTime)
        })
        return res
    }
    //получает информацию о чате
    static DeleteChatRoom(chatRoomId: number){
        api.delete<IChatRoom>("/api/Messenger/DeleteChatRoom/"+chatRoomId)
    }
}