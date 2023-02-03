import React, {CSSProperties, FC} from 'react';
import {IFriend} from "../types/IFriend";
import style from './style/InfoCard.module.css'
import ProfileImage from "./UI/ProfileImage";
import {Size} from '../types/Size'
import {useNavigate} from "react-router-dom";
import routes from '../consts'
import consts from "../consts";

interface Props {
    Friend: IFriend,
    Style?: CSSProperties
}

const FriendComponent : FC <Props>= (props) => {
    const navigate = useNavigate()
    var name = props.Friend.name + " " + props.Friend.surname
    return (
        <div
            className={style.card}
            onClick={()=>{navigate(routes.USER_PAGE_ROUTE + "?id="+props.Friend.userId)}}
            style={props?.Style ? props?.Style: {}}
        >
            <ProfileImage src={consts.API_URL + '/' + props.Friend.profileImage} size={Size.medium}/>
            <div className={style.name}>
                <span>
                    {name.length > 20 ?
                        name.slice(0, 17) + "..."
                        :
                        name}
                </span>
                <span>
                    {/*{props.Friend.nickname.length > 20 ?
                        props.Friend.nickname.slice(0, 17) + "..."
                        :
                        props.Friend.nickname}*/}
                    {props.Friend.nickname}
                </span>
            </div>
        </div>
    );
};

export default FriendComponent;