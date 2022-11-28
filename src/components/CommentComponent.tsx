import React, {FC, useState} from 'react';
import {IComment} from "../types/IComment";
import {useNavigate} from "react-router-dom";
import route from '../consts'
import ProfileImage from "./UI/ProfileImage";
import {Size} from "../types/Size";
import {ReactComponent as Reply} from './assets/reply-icon.svg'
import commentModule from './style/Comment.module.css'
import consts from "../consts";
interface Props {
    comment: IComment
}

const CommentComponent : FC<Props> = (props) => {
    const navigate = useNavigate()
    const [isShowReplyArea, setIsShowReplyArea] = useState(false)
    const showReplyArea = ()=>{
        setIsShowReplyArea(!isShowReplyArea)
    }
    return (
        <div className={commentModule.comment}>
            <div
                className={commentModule.userSection}
                /*onClick={()=>navigate(route.USER_PAGE_ROUTE + `?userId=${props.comment.UserId}`)}*/
                onClick={()=>{
                    navigate(route.USER_PAGE_ROUTE + `?id=${props.comment.userId}`);
                    console.log(props.comment.userId)}
                }
            >
                <ProfileImage src={consts.API_URL + props.comment.profileImage} size={Size.small}/>
                <div>
                    {props.comment.userName}
                </div>
            </div>
            <div className={commentModule.textSection}>
                {props.comment.isDeleted
                    ?
                    <div className={commentModule.deleted}>комментарий удален</div>
                    :
                    <div>
                        <span
                            onClick={()=>{
                                navigate(route.USER_PAGE_ROUTE + `?id=${props.comment.userId}`)}
                            }
                            className={commentModule.link}
                        >
                    {props.comment.isReply &&
                    props.comment.objectName + ","
                    }
                </span>
                        {" " + props.comment.message}
                    </div>
                }
            </div>
            <div>
                {props.comment.attachment != null &&
                    <a href={props.comment.attachment.fileLink} className={commentModule.link} target="_blank">Вложение</a>
                }
            </div>
            <div className={commentModule.replySection} onClick={()=>showReplyArea()}>
                <Reply className={commentModule.reply}/>
                <span>Ответить</span>
            </div>
            <div className={commentModule.replyForm} style={{display: `${isShowReplyArea ? "block" : "none"}`}}>
                <form action="#" method="post">
                    <textarea></textarea>
                    <button className={commentModule.link}>Ответить</button>
                </form>
            </div>
        </div>
    );
};

export default CommentComponent;