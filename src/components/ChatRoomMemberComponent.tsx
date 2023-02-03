import React, {FC} from 'react';
import {IUser} from "../types/IUser";
import style from "./style/Messenger.module.css"
import global from "./style/Global.module.css"
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {useNavigate} from "react-router-dom";

interface Props{
    member: IUser
}

const ChatRoomMemberComponent : FC<Props>= (props) => {
    const navigate = useNavigate()
    return (
        <div key={props.member.userId} className={style.chatRoomMember} onClick={()=>{navigate(consts.USER_PAGE_ROUTE + "?id="+props.member.userId)}}>
            <div>
                <ProfileImage src={consts.API_URL + props.member.profileImage} size={Size.small}/>
            </div>
            <div>
                {props.member.name} {props.member.surname}
            </div>
        </div>
    );
};

export default ChatRoomMemberComponent;