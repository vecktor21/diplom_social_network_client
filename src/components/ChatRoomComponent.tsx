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
                name+=x.name + x.surname
                setChatRoomImage(x.profileImage)
                setUserLink(x.userId)
            })
        setChatRoomName(name + ", " + chatRoomName  )


    }, [])

    //todo
    const exitFromChatRoom = (chat:IChatRoom)=>{

    }

    return (
        <div className={style.chatRoomComponent} onClick={(e)=>{
            e.stopPropagation()
            navigate(consts.MESSAGES_ROUTE+"/"+props.chatRoom.chatRoomId)
        }}>


                    <div>
                        <div className={style.messageSenderImage} onClick={(e)=>{
                            e.stopPropagation()
                            navigate(consts.USER_PAGE_ROUTE+"?id="+(props.chatRoom.lastMessage?.sender?.userId ? props.chatRoom.lastMessage.sender.userId : userLink))
                        }}><ProfileImage src={consts.API_URL + (props.chatRoom.lastMessage?.sender?.profileImage ? props.chatRoom.lastMessage.sender.profileImage : chatRoomImage)} size={Size.medium}/></div>
                        <div className={style.chatRoomContentSection}>
                            {
                                props.chatRoom.lastMessage == null
                                    ?
                                    <div>здесь еще нет сообщений</div>
                                    :
                                    <div>
                                        <div className={style.chatRoomName}>{chatRoomName}</div>
                                        <div className={style.chatRoomLastMessage}>{props.chatRoom.lastMessage.message}<span>{props.chatRoom.lastMessage.publicationDate.getFullYear()}</span></div>
                                    </div>

                            }
                        </div>
                    </div>

            <div className={style.chatRoomOptions}>
                <div title={"удалить чат"}>
                    <Cross className={global.cross} onClick={()=>{exitFromChatRoom(props.chatRoom)}}/>
                </div>
            </div>
        </div>
    );
};

export default ChatRoomComponent;