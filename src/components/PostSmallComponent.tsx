import React, {FC} from 'react';
import {useNavigate} from "react-router-dom";
import style from "./style/InfoCard.module.css";
import routes from "../consts";
import ProfileImage from "./UI/ProfileImage";
import consts from "../consts";
import {Size} from "../types/Size";
import {IPost} from "../types/IPost";
import {IFavoritePost} from "../types/IFavoritePost";
import global from './style/Global.module.css'

interface Props{
    post:IFavoritePost
}
const PostSmallComponent:FC<Props> = (props) => {
    const navigate = useNavigate()
    return (
        <div
            className={style.card+" "+style.wideCart}
            onClick={()=>{navigate(routes.POST_ROUTE + `?postId=${props.post.postId}&postType=${props.post.postType}`)}}
        >
            <ProfileImage src={consts.API_URL + props.post.authorImage} size={Size.medium}/>
            <div className={style.smallPostInfo}>
                <div>{props.post.authorName}</div>

                <div >
                    дата публикации:
                    {props.post.publicationDate.getFullYear()}.
                    {props.post.publicationDate.getMonth()+1}.
                    {props.post.publicationDate.getDate()}
                </div>
                <div>
                    {props.post.postTitle.length > 20 ?
                        props.post.postTitle.slice(0, 17) + "..."
                        :
                        props.post.postTitle}
                </div>
                <div>
                    {props.post.text.length > 20 ?
                        props.post.text.slice(0, 17) + "..."
                        :
                        props.post.text}</div>
            </div>
        </div>
    );
};

export default PostSmallComponent;
