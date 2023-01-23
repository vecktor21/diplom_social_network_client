import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {IMessageCreateModel} from "../../types/IMessageCreateModel";

const ChatRoomPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [chatRoom, setChatRoom] = useState({} as IChatRoom)
    const params = useParams()
    const {userStore}= useContext(Context)
    const [newMessage, setNewMessage] = useState({} as IMessageCreateModel)

    //signalR
    const signalr = require("@microsoft/signalr")
    const [connection, setConnection] = useState({} as HubConnection)
    const [chat, setChat] = useState([] as IMessage[])
    const latestChat = useRef([] as IMessage[])

    // @ts-ignore
    latestChat.current = chat


    useEffect(()=>{
        fetchChatRoom()

        //signalR
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7021/chat')
            .withAutomaticReconnect()
            .build();
        setConnection(newConnection);

    },[])

    //signalR
    useEffect(() => {
        if (connection.state) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('Notify', message => {
                        /*const updatedChat = [...latestChat.current];
                        updatedChat.push(message);

                        setChat(updatedChat);*/
                        console.log(message)
                    });
                    connection.on('Receive', (message : IMessage) => {
                        const updatedChat = [...latestChat.current];
                        updatedChat.push(message);

                        setChat(updatedChat);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = ()=>{

    }

    const fetchChatRoom = async()=>{
        setIsLoading(true)
        try {
            const response = await MessengerService.GetChatRoom(Number(params.chatRoomId))

            setChatRoom(response.data)
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
                                    {chatRoom.messages.map(message=> {
                                        //console.log(message.sender.userId == userStore?.user.userId)
                                        return <MessageComponent
                                                message={message}
                                                key={message.messageId}
                                                isMine={message.sender.userId == userStore?.user.userId}
                                            />
                                        }
                                    )}
                                    <div className={style.chatRoomSendMessage}>
                                        <input type="text" value={}/>
                                    </>
                                </div>
                                <div className={style.chatRoomMembers}>
                                    {chatRoom.members.map(member=>
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