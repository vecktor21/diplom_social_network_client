import React, {FC} from 'react';
import {IChatRoom} from "../types/IChatRoom";
import style from "./style/Messenger.module.css"
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {ReactComponent as Cross} from "./assets/cross-icon.svg";
import global from "./style/Global.module.css";
import {useNavigate} from "react-router-dom";
interface Props {
    chatRoom: IChatRoom
}

const ChatRoomComponent :FC <Props> = (props) => {
    const navigate = useNavigate()
    //todo
    const exitFromChatRoom = (chat:IChatRoom)=>{

    }

    return (
        <div className={style.chatRoomComponent} onClick={(e)=>{
            e.stopPropagation()
            navigate(consts.MESSAGES_ROUTE+"/"+props.chatRoom.chatRoomId)
        }}>

            <div className={style.messageSenderImage} onClick={(e)=>{
                e.stopPropagation()
                navigate(consts.USER_PAGE_ROUTE+"?id="+props.chatRoom.lastMessage.sender.userId)
            }}><ProfileImage src={consts.API_URL + props.chatRoom.lastMessage.sender.profileImage} size={Size.medium}/></div>
            <div className={style.chatRoomContentSection}>
                <div className={style.chatRoomName}>{props.chatRoom.chatRoomName}</div>
                <div className={style.chatRoomLastMessage}>{props.chatRoom.lastMessage.message}<span>{props.chatRoom.lastMessage.publicationDate.getFullYear()}</span></div>
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