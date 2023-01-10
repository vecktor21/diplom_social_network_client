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
import ArticlesService from "../services/ArticlesService";

interface Props {
    article: IArticle
}
const ArticleObjectComponent : FC<Props> = observer((props) => {
    const navigate = useNavigate()
    
    const {userStore, userFavoritesStore} = useContext(Context)
    const [isFav, setIsFav] = useState(false)
    useEffect(()=>{
        if(userFavoritesStore?.Favorites != undefined){
            setIsFav(userFavoritesStore?.Favorites.filter(f=>f.ObjectId==props.article.articleId).length>0)
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

    //удаление статьи:
    const deleteHandler = async ()=>{
        if(window.confirm("вы уверены что хоите удалить эту статью?")){
            await ArticlesService.DeleteArticle(props.article.articleId)
            alert("статья удалена")
        }
    }
    return (
        <div className={style.articleObject} onClick={(e)=>{
            e.stopPropagation()
            //навигация на страницу статьи
            navigate(`${routes.ARTICLE_NAVIGATION_ROUTE}/${props.article.articleId}`)
        }}>
            <div
                 title={props.article.title}
                 className={style.articleObject_title}><b>Название: </b>{props.article.title}</div>
            <div className={style.articleObject_author}><b>Автор: </b><span onClick={(e)=>{
                e.stopPropagation()
                navigate(routes.USER_PAGE_ROUTE+"?id="+props.article.author.userId)

            }}>{props.article.author.name}</span></div>
            <div className={style.articleObject_rating}><b>Рейтинг: </b>{props.article.rating}</div>
            <div>
                <b>ключевые слова:</b>
                <div className={global.flexBlock}>
                    {props.article.articleKeyWords.map(w=>
                        <div key={w.keyWordId} className={style.keyWordObject} title={w.keyWordRu}>
                            {w.keyWordRu}
                        </div>
                    )}
                </div>
            </div>
            {userStore?.user.userId==props.article.author.userId
            ?
                <div>
                    <button onClick={(e)=>{
                        e.stopPropagation()
                        navigate(routes.ARTICLE_NAVIGATION_ROUTE+"/update/"+props.article.articleId)
                    }
                    }>изменить</button>
                    <button onClick={deleteHandler}>удалить</button>
                </div>
            :
                <div>
                    <Like
                        className={`${props.article.likes.filter(l=>l.likedUserId==userStore?.user.userId).length>0
                            ?
                            global.like + " " + global.button + " " + global.liked
                            :
                            global.like + " " + global.button
                        }`}
                        onClick={(e)=>{
                            e.stopPropagation()
                            like(props.article.articleId)
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
                            addToFavorite(props.article.articleId)
                        }}
                    />
                </div>
            }
        </div>
    );
});

export default ArticleObjectComponent;