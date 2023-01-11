import React, {useContext, useEffect, useState} from 'react';
import style from "../style/Articles.module.css";
import {IArticle} from "../../types/IArticle";
import {Context} from "../../index";
import ArticlesService from "../../services/ArticlesService";
import ArticleObjectComponent from "../ArticleObjectComponent";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import global from "../style/Global.module.css";

const ArticlesRecommendedPanel = () => {
    const [articles, setArticles] = useState([] as IArticle[])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const {userStore} = useContext(Context)
    useEffect(()=>{
        fetchRecomendations()
    },[])
    const fetchRecomendations = async()=>{
        try{
            // @ts-ignore
            const response = await ArticlesService.GetRecomendedArticles(userStore?.user.userId)
            setArticles(response.data)
            console.log(response.status)
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
                    ?
                    <ErrorComponent/>
                    :
                    <div>
                        <div className={global.pageArticle}>Мои рекомендации</div>
                        {
                            articles.length==0
                                ?
                                <div>у вас еще нет рекомендаций. попробуйте добавить какие-либо ключевые слова в свои интересы</div>
                                :
                            articles.map(a=>
                                <ArticleObjectComponent key={a.articleId} article={a}/>
                            )
                        }
                    </div>

            }
        </div>
    );
};

export default ArticlesRecommendedPanel;