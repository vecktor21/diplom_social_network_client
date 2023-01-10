import React, {useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import ArticleObjectComponent from "../ArticleObjectComponent";
import ArticlesService from "../../services/ArticlesService";
import {useParams} from "react-router-dom";
import {IArticle} from "../../types/IArticle";

const UserArticlesPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [articles, setArticles] = useState([] as IArticle[])
    const params = useParams()
    useEffect(()=>{
        fetchArticles()
    },[])

    const fetchArticles = async ()=>{
        const response = await ArticlesService.GetArticlesByAuthor(Number(params.userId))
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
        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    <LoadingComponent/>
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :

                        <div className={global.mainSection}>
                            <div className={global.pageArticle}>Статьи автора</div>
                            {
                                articles.length == 0
                                    ?
                                    <div>
                                        у этого пользователя еще нет статей
                                    </div>
                                    :
                                    articles.map(a=>
                                        <ArticleObjectComponent key={a.articleId} article={a}/>
                                    )
                            }
                        </div>
                    }
                </div>
            }

        </div>
    );
};

export default UserArticlesPage;