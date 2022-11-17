import React, {FC, useContext, useEffect, useState} from 'react';
import {IArticle} from "../types/IArticle";
import style from './style/Articles.module.css'
import global from './style/Global.module.css'
import {ReactComponent as Like} from "./assets/heart-icon.svg";
import {ReactComponent as Favorite} from "./assets/favorite-icon.svg";
import {useNavigate} from "react-router-dom";
import routes from '../consts'
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import UserService from "../services/UserService";
import {ObjectTypes} from "../types/ObjectTypes";

interface Props {
    article: IArticle
}
const ArticleObjectComponent : FC<Props> = observer((props) => {
    const navigate = useNavigate()
    const {userStore, userFavoritesStore} = useContext(Context)
    const [isFav, setIsFav] = useState(false)
    useEffect(()=>{
        if(userFavoritesStore?.Favorites != undefined){
            setIsFav(userFavoritesStore?.Favorites.filter(f=>f.ObjectId==props.article.ArticleId).length>0)
        }
    }, [])
    //todo
    const like=(objectId:number)=>{
        if(userStore?.user.userId!=undefined){
            UserService.AddToFavorites(userStore?.user.userId, objectId, ObjectTypes.ArticleFav)
            alert("лайкнул")
        }else{
            alert("ошибка, вы не вошли")
        }
    }
    //todo
    const addToFavorite=(objectId:number)=>{
        if(userStore?.user.userId!=undefined){
            UserService.AddToFavorites(userStore?.user.userId, objectId, ObjectTypes.ArticleFav)
            alert("добавил в избранное")
        }else{
            alert("ошибка, вы не вошли")
        }
    }

    return (
        <div className={style.articleObject} onClick={(e)=>{
            e.stopPropagation()
            navigate(routes.ARTICLE_ROUTE+"?articleId="+props.article.ArticleId)
        }}>
            <div
                 title={props.article.Title}
                 className={style.articleObject_title}><b>Название: </b>{props.article.Title}</div>
            <div className={style.articleObject_author}><b>Автор: </b><span onClick={(e)=>{
                e.stopPropagation()
                navigate(routes.USER_PAGE_ROUTE+"?userId="+props.article.Author.authorId)

            }}>{props.article.Author.name}</span></div>
            <div className={style.articleObject_rating}><b>Рейтинг: </b>{props.article.Rating}</div>
            <div>
                <b>ключевые слова:</b>
                <div className={global.flexBlock}>
                    {props.article.KeyWords.map(w=>
                        <div key={w.KeyWordId} className={style.keyWordObject} title={w.KeyWord}>
                            {w.KeyWord}
                        </div>
                    )}
                </div>
            </div>
            {userStore?.user.userId==props.article.Author.authorId
            ?
                <div>
                    <button onClick={(e)=>{
                        e.stopPropagation()
                        navigate(routes.ARTICLE_ROUTE+"?articleId="+props.article.ArticleId)
                    }
                    }>изменить</button>
                </div>
            :
                <div>
                    <Like
                        className={`${props.article.Likes.filter(l=>l.likedUserId==userStore?.user.userId).length>0
                            ?
                            global.like + " " + global.button + " " + global.liked
                            :
                            global.like + " " + global.button
                        }`}
                        onClick={(e)=>{
                            e.stopPropagation()
                            like(props.article.ArticleId)
                        }}
                    />
                    <Favorite
                        className={`${ isFav
                            ?
                            global.favorite + " " + global.button + " " + global.favorited
                            :
                            global.favorite + " " + global.button
                        }`}
                        onClick={(e)=>{
                            e.stopPropagation()
                            addToFavorite(props.article.ArticleId)
                        }}
                    />
                </div>
            }
        </div>
    );
});

export default ArticleObjectComponent;