import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {IArticle} from "../../types/IArticle";
import ArticlesService from "../../services/ArticlesService";
import {Context} from "../../index";
import ArticleObjectComponent from "../ArticleObjectComponent";
import style from "../style/Articles.module.css";
import LoadingComponent from "../UI/LoadingComponent";

const ArticlesMyArticlesPanel = observer(() => {
    const [articles, setArticles] = useState([] as IArticle[])
    const [isLoading, setIsLoading] = useState(true)
    const {userStore} = useContext(Context)
    useEffect(()=>{
        // @ts-ignore
        const articlesResponse = ArticlesService.GetArticlesByAuthor(userStore?.user.userId)
        setArticles(articlesResponse)
        setIsLoading(false)
    },[])
    return (
        <div>
            {isLoading
            ?
                <LoadingComponent/>
            :<div>
                    <div className={style.sectionName}>Мои статьи</div>
                    {
                        articles.map(a=>
                            <ArticleObjectComponent key={a.ArticleId} article={a}/>
                        )
                    }
                </div>
            }
        </div>
    );
});

export default ArticlesMyArticlesPanel;