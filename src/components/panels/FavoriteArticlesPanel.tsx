import React, {FC, useContext, useEffect, useState} from 'react';
import style from "../style/Articles.module.css";
import {IArticle} from "../../types/IArticle";
import {Context} from "../../index";
import ArticlesService from "../../services/ArticlesService";
import ArticleObjectComponent from "../ArticleObjectComponent";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import global from "../style/Global.module.css";
import {BanService} from "../../services/BanService";
import {IBannedUser} from "../../types/IBannedUser";
import BannedUserComponent from "../BannedUserComponent";
import FavoriteService from "../../services/FavoriteService";

const FavoriteArticlesPanel= () => {
    const {userStore} = useContext(Context)
    const [articles, setArticles] = useState([] as IArticle[])
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{
        fetchBanList()
    },[])
    const fetchBanList = async()=>{
        try{
            if(!userStore?.user){
                setIsError(true)
                return
            }
            const res = await FavoriteService.GetFavoriteArticles(userStore?.user.userId)
            setArticles(res)
        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }
    return (
        <div>
            {isLoading
                ?
                <LoadingComponent/>
                :
                isError
                    ?<ErrorComponent/>
                    :
                <div>
                    {
                        articles.map(a=>
                            <ArticleObjectComponent article={a} key={a.articleId}/>
                        )
                    }
                </div>
            }
        </div>
    );
};

export default FavoriteArticlesPanel;
