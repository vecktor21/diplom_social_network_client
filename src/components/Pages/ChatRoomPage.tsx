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
import {ReactComponent as Attachment} from '../assets/attachment-icon.svg'
import {ReactComponent as Send} from '../assets/send-icon.svg'
import FileService from "../../services/FileService";
import PostService from "../../services/PostService";
import FileUploadComponent from "../UI/FileUploadComponent";
import {GlobalService} from "../../services/GlobalService";
import ChatRoomMemberComponent from "../ChatRoomMemberComponent";

const ChatRoomPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [chatRoom, setChatRoom] = useState({} as IChatRoom)
    const params = useParams()
    const {userStore}= useContext(Context)
    const [newMessage, setNewMessage] = useState({
        chatRoomId: 0,
        text: "",
        senderId: 0,
        messageAttachmentIds: [] as number[]
    } as IMessageCreateModel)

    //загрузка файлов
    //для открытия модального окна
    const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false)
    //файлы для загрузки на страницу
    const [filesToUpload, setFilesToUpload] = useState([] as File[])

    //signalR
    const signalr = require("@microsoft/signalr")
    const [connection, setConnection] = useState({} as HubConnection)
    const [chat, setChat] = useState<IMessage[]>([] )
    let latestChat = useRef<IMessage[] | null>(null)

    latestChat.current = chat
    /*console.log("main: chat: ", chat)
    console.log("main: latestChat: ", latestChat)
    console.log("main: latestChat.current: ", latestChat.current)*/

    useEffect(()=>{
        const messagesBlock = document.getElementById("messagesBlock")
        if(messagesBlock){
            messagesBlock.scrollTop = messagesBlock.scrollHeight
        }
    }, [chatRoom, chat, latestChat])

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
                        console.log("Notify: ",message)
                    });
                    connection.on('Receive', (message : IMessage) => {
                        if(latestChat && latestChat.current){

                            const updatedChat = [...latestChat.current];
                            message.sendingTime = GlobalService.JsonDateStringToDateObj(message.sendingTime)

                            updatedChat.push(message);

                            setChat(updatedChat);
                            console.log("on Receive", message)
                            console.log("on Receive: updatedChat: ", updatedChat)
                        }
                    });
                    connection.on('Error', (message : string) => {
                        console.log("on Error", message)
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);


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

    //отправка сообшения
    const sendMessageHandler = async()=>{
        setIsLoading(true)
        const formData = new FormData()
        if(filesToUpload.length>0){
            filesToUpload.forEach(file=>{
                formData.append("files", file)
            })
        }

        try{
            const fileResult = await FileService.UploadFiles(formData)
            newMessage.senderId = userStore?.user.userId as number
            newMessage.chatRoomId = Number(params.chatRoomId)
            fileResult.data.forEach(data=>{
                newMessage.messageAttachmentIds.push(data.fileId)
            })

            await sendMessage(newMessage)
            setNewMessage({...newMessage, text: ""})
        }
        catch(e){
            console.log(e)
            alert("ошибка отправки сообщения")
        }
        finally {

            setIsLoading(false)
        }
    }

    //рикрепление файлов к сообщению
    const uploadFiles = async ()=>{
        setIsLoading(true)
        const formData = new FormData()
        filesToUpload.forEach(file=>{
            formData.append("files", file)
        })
        try{
            //await FileService.UploadFiles(formData)
            alert("файлы успешно добавлены")
            setIsFileUploadModalVisible(false)
        }
        catch(e){
            console.log(e)
            alert("ошибка загрузки файлов")
        }
        finally {
            setIsLoading(false)
        }
    }


    //отправка сообщения
    const sendMessage = async (message: IMessageCreateModel)=>{
        if (connection.state) {
            try {
                await connection.send('Send', message);
            }
            catch(e) {
                console.log(e);
            }
        }
        else {
            alert('No connection to server yet.');
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
                            {/*модальное окно для загрузки файлов */}
                            <FileUploadComponent
                                isVisible={isFileUploadModalVisible}
                                setIsVisible={setIsFileUploadModalVisible}
                                files={filesToUpload}
                                setFiles={setFilesToUpload}
                                uploadHandler={uploadFiles}
                            />
                            <div className={global.pageArticle}>{chatRoom.chatRoomName}</div>
                            <div className={style.chatRoomContent}>
                                <div className={style.chatRoomMessages} id="messagesBlock">
                                    {chatRoom.messages.map(message=> {
                                        //console.log(message.sender.userId == userStore?.user.userId)
                                        return <MessageComponent
                                                message={message}
                                                key={message.messageId}
                                                isMine={message.sender.userId == userStore?.user.userId}
                                            />
                                        }
                                    )}
                                    {chat.map(message=> {
                                            //console.log(message.sender.userId == userStore?.user.userId)
                                            return <MessageComponent
                                                message={message}
                                                key={message.messageId}
                                                isMine={message.sender.userId == userStore?.user.userId}
                                            />
                                        }
                                    )}
                                    <div className={style.chatRoomSendMessage}>
                                        <input
                                            type="text" value={newMessage.text}
                                            onChange={(e)=>{setNewMessage({...newMessage, text: e.target.value})}}
                                            onKeyDown={(e)=>{
                                                console.log(e)
                                                if(e.keyCode==13){
                                                    sendMessageHandler()
                                                }
                                            }}
                                        />

                                        <Attachment className={global.attachment} onClick={()=>{setIsFileUploadModalVisible(true)}}/>
                                        <Send
                                            onClick={sendMessageHandler}

                                            className={global.send}
                                        />
                                    </div>
                                </div>
                                <div className={style.chatRoomMembers}>
                                    {chatRoom.members.map(member=>
                                        <ChatRoomMemberComponent member={member} key={member.userId}/>

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