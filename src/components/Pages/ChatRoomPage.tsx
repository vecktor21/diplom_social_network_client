import React, {useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import style from '../style/Messenger.module.css'
import {IMessage} from "../../types/IMessage";
import {useParams} from "react-router-dom";
import {MessengerService} from "../../services/MessengerService";
import {IChatRoom} from "../../types/IChatRoom";
import MessageComponent from "../MessageComponent";
import {Context} from "../../index";

const ChatRoomPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [messages, setMessages] = useState([] as IMessage[])
    const [chatRoom, setChatRoom] = useState({} as IChatRoom)
    const params = useParams()
    const {userStore}= useContext(Context)

    useEffect(()=>{
        fetchMessages()
        fetchChatRoom()
    },[])

    const fetchChatRoom = ()=>{
        setIsLoading(true)
        try {
            const response = MessengerService.GetChatRoom(Number(params.chatRoomId))
            // @ts-ignore
            setChatRoom(response)
        }
        catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {

        }{
            setIsLoading(false)
        }
    }

    const fetchMessages=()=>{
        setIsLoading(true)
        try {
            const response = MessengerService.GetChatRoomMessages(Number(params.chatRoomId))
            // @ts-ignore
            setMessages(response)
            console.log(response)
        }
        catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    <LoadingComponent/>
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :

                        <div className={global.mainSection}>
                            <div className={global.pageArticle}>{chatRoom.chatRoomName}</div>
                            <div className={style.chatRoomContent}>
                                <div className={style.chatRoomMessages}>
                                    {messages.map(message=> {
                                        //console.log(message.sender.userId == userStore?.user.userId)
                                        return <MessageComponent
                                                message={message}
                                                key={message.messageId}
                                                isMine={message.sender.userId == userStore?.user.userId}
                                            />
                                        }
                                    )}
                                    <div className={style.chatRoomSendMessage}>
                                        секции набора сообщения
                                    </div>
                                </div>
                                <div className={style.chatRoomMembers}>
                                    {chatRoom.chatRoomMembers.map(member=>
                                        <div key={member.userId}>{member.name}</div>

                                    )}
                                </div>
                            </div>

                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default ChatRoomPage;