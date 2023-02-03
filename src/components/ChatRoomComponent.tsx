import React, {FC, useContext, useEffect, useState} from 'react';
import {IChatRoom} from "../types/IChatRoom";
import style from "./style/Messenger.module.css"
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {ReactComponent as Cross} from "./assets/cross-icon.svg";
import global from "./style/Global.module.css";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {MessengerService} from "../services/MessengerService";
interface Props {
    chatRoom: IChatRoom
}

const ChatRoomComponent :FC <Props> = (props) => {
    const navigate = useNavigate()
    const {userStore} = useContext(Context)
    const [chatRoomName, setChatRoomName] = useState("")
    const [chatRoomImage, setChatRoomImage] = useState("")
    const [userLink, setUserLink] = useState(0)
    useEffect(()=>{
        let name = ""
        console.log(props.chatRoom)
        props.chatRoom.members
            .filter(x=>x.userId!=userStore?._user.userId)
            .forEach(x=>{
                name+=x.name + " " + x.surname
                setChatRoomImage(x.profileImage)
                setUserLink(x.userId)
            })
        setChatRoomName((props.chatRoom.chatRoomName.length>0 ? props.chatRoom.chatRoomName + ", " : "")  +  name )


    }, [])

    const exitFromChatRoom = (chat:IChatRoom)=>{
        if(chat.chatRoomTypeId == 1){
            if(window.prompt("вы уверены что хотите удалить чат?")){
                MessengerService.DeleteChatRoom(chat.chatRoomId)
            }
        }
        //todo
        if(chat.chatRoomTypeId == 2){
            if(window.prompt("вы уверены что хотите выйти из чата??")){
                window.alert("выход")
            }
        }
    }

    return (
        <div className={style.chatRoomComponent} onClick={(e)=>{
            e.stopPropagation()
            navigate(consts.MESSAGES_ROUTE+"/"+props.chatRoom.chatRoomId)
        }}>


                    <div style={{display: "flex", width: '100%'}}>
                        <div className={style.messageSenderImage}
                             onClick={(e)=>{
                                e.stopPropagation()
                                navigate(consts.USER_PAGE_ROUTE+"?id="+(props.chatRoom.lastMessage?.sender?.userId ? props.chatRoom.lastMessage.sender.userId : userLink))
                        }}>
                            <ProfileImage src={consts.API_URL + (props.chatRoom.lastMessage?.sender?.profileImage ? props.chatRoom.lastMessage.sender.profileImage : chatRoomImage)} size={Size.medium}/>
                        </div>
                        <div className={style.chatRoomContentSection}>
                            <div className={style.chatRoomName}>{chatRoomName}</div>
                            {
                                props.chatRoom.lastMessage == null
                                    ?
                                    <div>здесь еще нет сообщений</div>
                                    :
                                    <div>
                                        <div className={style.chatRoomLastMessage}>
                                            {props.chatRoom.lastMessage.text}
                                            <span>
                                                {new Date().getFullYear()!=props.chatRoom.lastMessage.sendingTime.getFullYear() && props.chatRoom.lastMessage.sendingTime.getFullYear() + ", "}
                                                {new Date().getMonth()!=props.chatRoom.lastMessage.sendingTime.getMonth() && props.chatRoom.lastMessage.sendingTime.getMonth() + ", "}
                                                {new Date().getDate()!=props.chatRoom.lastMessage.sendingTime.getDate() && props.chatRoom.lastMessage.sendingTime.getDate() + ", "}
                                                {props.chatRoom.lastMessage.sendingTime.getHours()}:{props.chatRoom.lastMessage.sendingTime.getMinutes()}
                                            </span>
                                        </div>
                                    </div>

                            }
                        </div>
                    </div>

            <div className={style.chatRoomOptions}>
                {
                    props.chatRoom.chatRoomTypeId == 1
                        ?
                        <div title={"удалить чат"}>
                            <Cross className={global.cross} onClick={(e) => {
                                e.stopPropagation()
                                exitFromChatRoom(props.chatRoom)
                            }
                            }/>
                        </div>
                        :
                        <div title={"выйти из чата"}>
                            <Cross className={global.cross} onClick={(e) => {
                                e.stopPropagation()
                                exitFromChatRoom(props.chatRoom)
                            }
                            }/>


                        </div>
                }
            </div>
        </div>
    );
};

export default ChatRoomComponent;