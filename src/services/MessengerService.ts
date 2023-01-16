import {IChatRoom} from "../types/IChatRoom";
import {IUser} from "../types/IUser";

export class MessengerService {
    //получает все чаты пользователя
    //todo
    static GetUserChatRooms(userId: number){
        const chatRooms = []
        for(let i = 1; i<5; i++){
            chatRooms.push(this.GetChatRoom(i))
        }
        return chatRooms
    }
    //получает информацию о чате
    //todo
    static GetChatRoom(chatRoomId: number){
        return {
            chatRoomId: chatRoomId,
            chatRoomName: "chatRoom"+chatRoomId,
            chatRoomType: "private",
            chatRoomMembers: [
                {
                    userId: 1,
                    profileImage: "",
                    name: "Denis",
                    surname: "Odnourov",
                } as IUser,
                {
                    userId: 2,
                    profileImage: "",
                    name: "Dias",
                    surname: "Zhenisov",
                } as IUser
            ],
            lastMessage: {
                chatRoomId: chatRoomId,
                message: "some message",
                publicationDate: new Date(),
                messageId: Math.random()*100,
                attachments: [],
                sender: {
                    userId: Math.round( Math.random()*2),
                    surname: "some",
                    name: "user",
                    profileImage: ""
                }
            }
        }
    }
    //получает все сообщения в чате
    //todo
    static GetChatRoomMessages(chatRoomId:number){
        const messages = []
        for(let i = 1; i<5; i++){
            messages.push({
                chatRoomId: chatRoomId,
                message: "some message",
                publicationDate: new Date(),
                messageId: Math.random()*100,
                attachments: [],
                sender: {
                    userId: Math.round( Math.random()*2+1),
                    surname: "some",
                    name: "user",
                    profileImage: ""
                }
            })
        }
        return messages
    }
}