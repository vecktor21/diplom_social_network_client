import React, {CSSProperties, FC, ReactNode} from 'react';
import {IFriend} from "../types/IFriend";
import style from './style/InfoCard.module.css'
import ProfileImage from "./UI/ProfileImage";
import {Size} from '../types/Size'
import {useNavigate} from "react-router-dom";
import routes from '../consts'
import consts from "../consts";
import {UserShortViewModel} from "../types/UserShortViewModel";

interface Props {
    Style?: CSSProperties,
    user: UserShortViewModel,
    children?: ReactNode
}

const FriendComponent : FC <Props>= (props) => {
    const navigate = useNavigate()
    var name = props.user.fullName
    return (
        <div
            className={style.card}
            onClick={()=>{navigate(routes.USER_PAGE_ROUTE + "?id="+props.user.userId)}}
            style={props?.Style ? props?.Style: {}}
        >
            <ProfileImage src={consts.API_URL + '/' + props.user.profileImage} size={Size.medium}/>
            <div className={style.name}>
                <span>
                    {name.length > 20 ?
                        name.slice(0, 17) + "..."
                        :
                        name}
                </span>
            </div>
        </div>
    );
};

export default FriendComponent;
