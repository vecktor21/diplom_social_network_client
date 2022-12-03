import React, {FC, useContext, useEffect, useState} from 'react';
import {IComment} from "../types/IComment";
import {useNavigate, useSearchParams} from "react-router-dom";
import route from '../consts'
import ProfileImage from "./UI/ProfileImage";
import {Size} from "../types/Size";
import {ReactComponent as Reply} from './assets/reply-icon.svg'
import commentModule from './style/Comment.module.css'
import consts from "../consts";
import {Context} from "../index";
import {ICommentCreateModel} from "../types/ICommentCreateModel";
import {CommentService} from "../services/CommentService";
import {ReactComponent as Delete} from "./assets/delete-icon.svg";
import global from "./style/Global.module.css";
import {ReactComponent as Like} from "./assets/heart-icon.svg";
import LikeService from "../services/LikeService";
interface Props {
    comment: IComment
}

const CommentComponent : FC<Props> = (props) => {
    const navigate = useNavigate()
    const {userStore} = useContext(Context)
    const [isShowReplyArea, setIsShowReplyArea] = useState(false)
    const [isShowDeleteSection, setIsShowDeleteSection] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [replyComment, setReplyComment] = useState({
        postId: 0,
        message: '',
        userId: userStore?.user.userId,
        attachmentsId: [] as number[]
    } as ICommentCreateModel)


    const showReplyArea = ()=>{
        setIsShowReplyArea(!isShowReplyArea)
    }

    //ответить на коммент
    const replyToComment = ()=>{
        CommentService.ReplyToComment(props.comment.commentId, replyComment)
        setIsShowReplyArea(false)
    }

    //удалить коммент
    const deleteComment = ()=>{
        CommentService.DeleteComment(props.comment.commentId)
    }

    useEffect(()=>{
        if(userStore?.user.userId==props.comment.userId){
            setIsShowDeleteSection(true)
        }
        if(userStore?.user.role.toLocaleLowerCase() == "admin"){
            setIsShowDeleteSection(true)
        }
        //проверка - лайкнул ли текущий пользователь пост
        setIsLiked(LikeService.IsLiked(userStore?.user.userId, props.comment.likes))

    },[])

    //обработка лайков
    const likeHandler = async ()=>{
        if(userStore?.isAuth){
            await LikeService.LikeComment(userStore?.user.userId, isLiked, props.comment.commentId)
            if(isLiked){
                alert("убрал лайк")
            }else{

                alert("лайкнул")
            }
            setIsLiked(!isLiked)
        }else{
            alert("вы не вошли")
        }
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
            <div
                className={global.button}
                onClick={()=>{likeHandler()}}
            >
                {props.comment.likes.length}
                <Like className={
                    `${global.like} ${
                        isLiked &&
                        global.liked
                    }`
                }
                />
            </div>
            <div>
                {props.comment.commentAttachments.map(file=>
                    <a style={{marginRight: "20px"}} href={consts.API_URL + file.fileLink} className={commentModule.link} target="_blank">{file.fileName}</a>
                )}
            </div>
            {
                userStore?.isAuth &&
                <div>
                    <div className={commentModule.replySection} onClick={()=>showReplyArea()}>
                        <Reply className={commentModule.reply}/>
                        <span>Ответить</span>
                    </div>
                    {isShowDeleteSection &&
                    <Delete
                        className={global.delete}
                        onClick={()=>{deleteComment()}}
                    />
                    }
                </div>
            }
            <div className={commentModule.replyForm} style={{display: `${isShowReplyArea ? "block" : "none"}`}}>
                <form action="#" method="post">
                    <textarea
                        onChange={(e)=>{
                            setReplyComment({...replyComment, message: e.target.value})
                        }}
                    ></textarea>
                    <button
                        className={commentModule.link}
                        onClick={(e)=>{
                            e.preventDefault()
                            replyToComment()
                        }}
                    >Ответить</button>
                </form>
            </div>
        </div>
    );
};

export default CommentComponent;