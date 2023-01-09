import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {IArticle} from "../../types/IArticle";
import ArticlesService from "../../services/ArticlesService";
import {Context} from "../../index";
import ArticleObjectComponent from "../ArticleObjectComponent";
import style from "../style/Articles.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import routes from "../../consts";
import {useNavigate} from "react-router-dom";

const ArticlesMyArticlesPanel = observer(() => {
    const [articles, setArticles] = useState([] as IArticle[])
    const [isLoading, setIsLoading] = useState(true)
    const {userStore} = useContext(Context)
    const navigate = useNavigate()

    useEffect(()=>{
        fetchArticles()
    },[])

    const fetchArticles = async ()=>{
        // @ts-ignore
        const response = await ArticlesService.GetArticlesByAuthor(userStore?.user.userId)
        try{
            setArticles(response.data)
        }catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false)
        }

    }

    return (
        <div>
            {isLoading
            ?
                <LoadingComponent/>
            :<div>
                    <div className={style.sectionName}>Мои статьи</div>
                    <button onClick={(e)=>{
                        e.stopPropagation()
                        navigate(routes.ARTICLE_CREATE_ROUTE)
                    }}>создать статью</button>
                    {
                        articles.map(a=>
                            <ArticleObjectComponent key={a.articleId} article={a}/>
                        )
                    }
                </div>
            }
        </div>
    );
});

export default ArticlesMyArticlesPanel;