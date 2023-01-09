import React, {useContext, useEffect, useState} from 'react';
import style from "../style/Articles.module.css";
import {IArticle} from "../../types/IArticle";
import {Context} from "../../index";
import ArticlesService from "../../services/ArticlesService";
import ArticleObjectComponent from "../ArticleObjectComponent";
import LoadingComponent from "../UI/LoadingComponent";

const ArticlesRecommendedPanel = () => {
    const [articles, setArticles] = useState([] as IArticle[])
    const [isLoading, setIsLoading] = useState(true)
    const {userStore} = useContext(Context)
    useEffect(()=>{
        // @ts-ignore
        const articlesResponse = ArticlesService.GetRecommendedArticlesByAuthor(userStore?.user.userId)
        setArticles(articlesResponse)
        setIsLoading(false)
    },[])
    return (
        <div>
            {isLoading
                ?
                <LoadingComponent/>
                :<div>
                    <div className={style.sectionName}>Мои рекомендации</div>
                    {
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