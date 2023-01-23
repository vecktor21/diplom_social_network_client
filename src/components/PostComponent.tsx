import React, {FC, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {IPost} from "../types/IPost";
import page from './style/Page.module.css'
import post from './style/Post.module.css'
import global from './style/Global.module.css'
import image from './style/Image.module.css'
import ImageViewer from 'react-simple-image-viewer';
import {ReactComponent as Like} from './assets/heart-icon.svg'
import {ReactComponent as Comment} from './assets/comment-icon.svg'
import {ReactComponent as Share} from './assets/share-icon.svg'
import {IAuthorInfo} from "../types/IAuthorInfo";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import routes from '../consts'
import {IComment} from "../types/IComment";
import consts from '../consts'
import {ReactComponent as Delete} from "./assets/delete-icon.svg";
import postStyle from "./style/Post.module.css";
import LikeService from "../services/LikeService";

interface Props {
    post: IPost
    isShowDelete: boolean
    deletePost: ()=>void
}


const PostComponent : FC<Props> = observer((props) => {
    const {userStore} = useContext(Context)
    const navigate = useNavigate()
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)


    let comments = 0


    const openImageViewer = useCallback((index : number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };


    //обработка лайков
    const likeHandler = async ()=>{
        if(userStore?.isAuth){
            await LikeService.LikePost(userStore?.user.userId, isLiked, props.post.postId)
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


    const commentAction = ()=>{
        console.log(commentCount)
        navigate(routes.POST_ROUTE + `?postId=${props.post.postId}&postType=${props.post.postType}`)
    }
    //todo
    const shareAction = ()=>{
        alert("репостнул")
    }
    //итерирование комментариев чтобы вывести их красиво
    // @ts-ignore
    const iterateComments =  (comment: IComment) : number => {
        if (comment.replies.length == 0) {
            comments++
            return commentCount
        }
        for (let i = 0; i < comment.replies.length; i++) {
            comments++
            iterateComments(comment.replies[i])
            return commentCount
        }
    }


    useEffect(()=>{
        props.post.comments.forEach(comment=>{
            iterateComments(comment)
        })
        //проверка - лайкнул ли текущий пользователь пост
        setIsLiked(LikeService.IsLiked(userStore?.user.userId, props.post.likes))

    }, [])
    useEffect(()=>setCommentCount(comments), [comments])

    return (
        <div className={post.post}><div className={postStyle.authorInfo} onClick={()=>{navigate( props.post.postType =="user"? consts.USER_PAGE_ROUTE  + "?id=" + props.post.author.authorId : consts.GROUP_ROUTE + "?id=" + props.post.author.authorId)}}>
                <div className={image.medium}>
                    <img src={consts.API_URL + props.post.author.img} />
                </div>
                <div className={global.date}>
                    дата публикации:
                    {props.post.publicationDate.getFullYear()}.
                    {props.post.publicationDate.getMonth()+1}.
                    {props.post.publicationDate.getDate()}
                </div>
                <div>{props.post.author.name}</div>
                {props.isShowDelete &&
                <div>
                    <Delete
                        className={global.delete}
                        onClick={()=>{props.deletePost()}}
                    />
                </div>
                }
            </div>
            <div className={post.title}>{props.post.title}</div>
            <div className={post.text}>{props.post.text}</div>
            <div className={post.images}>
                {props.post.postAttachments.filter(att=>att.fileType=="image").map((attachment, index) => (
                    <img
                        src={ consts.API_URL+ attachment.fileLink }
                        onClick={ () => openImageViewer(index) }
                        width="300"
                        key={ index }
                        style={{ margin: '2px' }}
                        alt=""
                    />
                ))}
                {isViewerOpen &&
                    <ImageViewer src={props.post.postAttachments.map(attachment=>
                         consts.API_URL + attachment.fileLink)}
                         closeOnClickOutside={ true }
                         onClose={ closeImageViewer }
                    />
                }
            </div>
            <div>
                {props.post.postAttachments.filter(att=>att.fileType!="image").map((attachment, index) => (
                    <a key={attachment.attachmentId} target="_blank" href={consts.API_URL + attachment.fileLink}>{attachment.fileName}</a>
                ))}
            </div>
            <div className={post.bottomSection}>
                <div
                    className={global.button}
                    onClick={()=>{likeHandler()}}
                >
                    {props.post.likes.length}
                    <Like className={
                        `${global.like} ${
                            isLiked &&
                            global.liked
                        }`
                    }
                    />
                </div>
                <div
                    className={global.button}
                    onClick={()=>{commentAction()}}
                >{
                    commentCount

                } <Comment className={global.comment}/></div>
                <div
                    className={global.button}
                    onClick={()=>{shareAction()}}
                ><Share className={global.comment}/></div>
            </div>
        </div>
    );
});

export default PostComponent;