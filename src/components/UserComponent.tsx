import React, {FC, ReactNode} from 'react';
import {UserShortViewModel} from "../types/UserShortViewModel";
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {useNavigate} from "react-router-dom";
import style from "./style/InfoCard.module.css";

interface Props{
    user: UserShortViewModel,
    children?: ReactNode
}
const UserComponent :FC<Props>= (props) => {
    const navigate = useNavigate()
    return (
        <div onClick={()=>{navigate(consts.USER_PAGE_ROUTE+"?id="+props.user.userId)}} className={style.card}>
            <div><ProfileImage src={consts.API_URL+props.user.profileImage} size={Size.medium}/></div>
            <div>{props.user.fullName}</div>
            <div>{props?.children}</div>
        </div>
    );
};

export default UserComponent;
