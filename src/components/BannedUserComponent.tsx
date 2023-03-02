import React, {FC, useContext} from 'react';
import {IBannedUser} from "../types/IBannedUser";
import {ReactComponent as Cross} from "./assets/cross-icon.svg";
import global from "./style/Global.module.css";
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {useNavigate} from "react-router-dom";
import style from "./style/Ban.module.css"
import {BanService} from "../services/BanService";
import {Context} from "../index";

interface Props{
    BannedUser:IBannedUser,
    setIsLoading: (v:boolean)=>void
    setIsError: (v:boolean)=>void
}
const BannedUserComponent : FC<Props>= (props) => {
    const navigate = useNavigate()
    const {userStore} = useContext(Context)
    const removeHandler=async()=>{
        if(!userStore?.user.userId){
            window.alert("ошибка, вы не авторизованы")
            return;
        }
        props.setIsLoading(true)
        props.setIsError(false)
        try {
            const res = await BanService.RemoveFromUserBlockList(userStore?.user.userId, props.BannedUser.blockedUserId)
            console.log(res)
            if(res.status==200){
                window.alert("успех")
            }
        }catch (e) {
            props.setIsError(true)
            console.log(e)
        }
        props.setIsLoading(false)
        window.location.reload()
    }
    return (
        <div
            onClick={()=>{navigate(consts.USER_PAGE_ROUTE+"?id="+props.BannedUser.blockedUserId)}}
            className={style.bannedUser}
        >
            <div>
                <ProfileImage src={consts.API_URL+props.BannedUser.blockedUserImage} size={Size.medium}/>
            </div>
            <div>
                <div>{props.BannedUser.blockedUserName}</div>
                <div>Причина блокировки: {props.BannedUser.reason}</div>
                <div>{`дата блокировки: ${props.BannedUser.dateFrom.getFullYear()}-${props.BannedUser.dateFrom.getMonth()+1}-${props.BannedUser.dateFrom.getDay()+1} по: ${props.BannedUser.dateTo.getFullYear()}-${props.BannedUser.dateTo.getMonth()+1}-${props.BannedUser.dateTo.getDay()+1}`}</div>
            </div>
            <div title={"удалить из черного списка"}>
                <Cross className={global.cross} onClick={(e) => {
                    e.stopPropagation()
                    removeHandler()
                }
                }/>
            </div>
        </div>
    );
};

export default BannedUserComponent;
