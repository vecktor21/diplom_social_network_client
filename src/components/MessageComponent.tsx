import React, {FC, useContext, useEffect} from 'react';
import {IMessage} from "../types/IMessage";
import style from "./style/Messenger.module.css"
import global from "./style/Global.module.css"
import {Context} from "../index";
import {ReactComponent as Options} from './assets/options-icon.svg'
import consts from "../consts";
import commentModule from "./style/Comment.module.css";
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
                <div className={style.messageText}>
                    <div>{props.message.text}</div>
                    <div style={{marginLeft:"10px", display: "flex", justifyContent: "space-between"}}>
                        <div>
                            {new Date().getFullYear()!=props.message.sendingTime.getFullYear() && props.message.sendingTime.getFullYear() + ", "}
                            {new Date().getMonth()!=props.message.sendingTime.getMonth() && props.message.sendingTime.getMonth() + ", "}
                            {new Date().getDate()!=props.message.sendingTime.getDate() && props.message.sendingTime.getDate() + ", "}
                            {props.message.sendingTime.getHours()}:{props.message.sendingTime.getMinutes()}
                        </div>
                        <div style={{marginLeft:"10px", boxSizing:"border-box"}}>{props.isMine ? <Options style={{boxSizing:"border-box", padding:"3px"}} className={global.options}/> : null}</div>
                    </div>

                </div>
                <div>
                    {
                        props.message.messageAttachments.length > 0
                        ?

                            props.message.messageAttachments.map(file=>
                                <a style={{marginRight: "20px"}} href={consts.API_URL + file.fileLink} className={commentModule.link} target="_blank">{file.fileName}</a>
                            )
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default MessageComponent;