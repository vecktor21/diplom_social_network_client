import React, {FC, useContext, useEffect} from 'react';
import {IMessage} from "../types/IMessage";
import style from "./style/Messenger.module.css"
import global from "./style/Global.module.css"
import {Context} from "../index";
import {ReactComponent as Options} from './assets/options-icon.svg'
interface Props {
    message: IMessage,
    isMine:boolean
}

const MessageComponent :FC<Props>= (props) => {
    const {userStore}= useContext(Context)
    useEffect(()=>{

    },[])
    return (
        <div className={style.messageContainer}>
            <div className={style.message + " " + (props.isMine ? style.myMessage : "")}>
                <div>sender: {props.message.sender.userId}</div>
                <div>{props.message.message}</div>
                <div>{props.isMine}</div>
                <div>{props.message.publicationDate.getHours()}:{props.message.publicationDate.getMinutes()}</div>
                {props.isMine ? <Options className={global.options}/> : null}
            </div>
        </div>
    );
};

export default MessageComponent;