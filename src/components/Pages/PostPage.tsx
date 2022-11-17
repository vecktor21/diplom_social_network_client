import React, {ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {observable} from "mobx";
import global from '../style/Global.module.css'
import postStyle from '../style/Post.module.css'
import {observer} from "mobx-react-lite";
import {IPost} from "../../types/IPost";
import PostService from "../../services/PostService";
import image from "../style/Image.module.css";
import ImageViewer from "react-simple-image-viewer";
import {ReactComponent as Like} from "../assets/heart-icon.svg";
import {ReactComponent as Comment} from "../assets/comment-icon.svg";
import {ReactComponent as Share} from "../assets/share-icon.svg";
import {IUser} from "../../types/IUser";
import {IAuthorInfo} from "../../types/IAuthorInfo";
import routes from "../../consts";
import {Context} from "../../index";
import {IComment} from "../../types/IComment";
import CommentComponent from "../CommentComponent";
import ErrorComponent from "../UI/ErrorComponent";

const PostPage = observer(() => {
    const {userStore} = useContext(Context)
    const [params] = useSearchParams()
    const postId = Number(params.get("postId"))
    const [isError, setIsError] = useState(false)
    //const [post, setPost] = useState({Author: {Img: ""}, Comments: [{}], PostAttachments: [{}], Likes: [{}]} as IPost)
    const [post, setPost] = useState({} as IPost)
    const [isLoading, setIsLoading] = useState(true)
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(0)

    let comments = 0

    const openImageViewer = useCallback((index : number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    useEffect(()=>{
        if(postId == undefined || postId == null || postId == Number("")){
            setIsError(true)
        }

        const postResult = PostService.GetPost(postId)
        setPost(postResult)

        setIsLoading(false)
        console.log(postResult.comments)

        postResult.comments.forEach(comment=>{
            iterateComments(comment)
        })
    }, [])


    // @ts-ignore
    const iterateComments =  (comment: IComment) : number => {
        if (comment.replies.length == 0) {
            comments++
            return 0
        }
        for (let i = 0; i < comment.replies.length; i++) {
            comments++
            iterateComments(comment.replies[i])
            return 0
        }
    }


    useEffect(()=>setCommentCount(comments), [comments])


    const likeAction = ()=>{
        alert("лайкнул")
    }
    const commentAction = ()=>{
        window.location.reload()
    }
    const shareAction = ()=>{
        alert("репостнул")
    }
    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    LOADING
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :
                        <div className={postStyle.post} style={{marginTop: "20px"}}>
                            <div className={postStyle.authorInfo}>
                                <div className={image.medium}>
                                    <img src={post.author.img} />
                                </div>
                                <div className={postStyle.date}>
                                    дата публикации:
                                    {post.publicationDate.getFullYear()}.
                                    {post.publicationDate.getMonth()+1}.
                                    {post.publicationDate.getDate()}
                                </div>
                                <div>{post.author.name}</div>
                            </div>
                            <div className={postStyle.title}>{post.title}</div>
                            <div className={postStyle.text}>{post.text}</div>
                            <div className={postStyle.images}>
                                {post.postAttachments.map((attachment, index) => (
                                    <img
                                        src={ attachment.fileLink }
                                        onClick={ () => openImageViewer(index) }
                                        width="300"
                                        key={ index }
                                        style={{ margin: '2px' }}
                                        alt=""
                                    />
                                ))}
                                {isViewerOpen &&
                                <ImageViewer
                                    src={post.postAttachments.map(attachment=>attachment.fileLink)}
                                             closeOnClickOutside={ true }
                                             onClose={ closeImageViewer }
                                />
                                }
                            </div>
                            <div className={postStyle.bottomSection}>
                                <div
                                    className={global.button}
                                    onClick={()=>{likeAction()}}
                                >
                                    {post.likes.length} <Like className={
                                    `${global.like} ${
                                        post.likes.filter(like =>
                                            like.likedUserId === userStore?.user.userId
                                        ).length > 0 &&
                                        global.liked
                                    }`
                                }
                                /></div>
                                <div
                                    className={global.button}
                                    onClick={()=>{commentAction()}}
                                >{commentCount} <Comment className={global.comment}/></div>
                                <div
                                    className={global.button}
                                    onClick={()=>{shareAction()}}
                                ><Share className={global.comment}/></div>
                            </div>
                            <div>
                                {
                                    post.comments.map(comment=>
                                        PostService.IterateComments(comment)
                                    )
                                }
                            </div>
                        </div>
                    }
                </div>

            }
        </div>
    );
});

export default PostPage;