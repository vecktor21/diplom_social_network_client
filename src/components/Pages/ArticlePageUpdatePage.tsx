import React, {useEffect, useState} from 'react';
import {IArticleUpdateModel} from "../../types/IArticleUpdateModel";
import {useNavigate, useParams} from "react-router-dom";
import {IKeyWord} from "../../types/IKeyWord";
import ArticlesService from "../../services/ArticlesService";
import KeyWordService from "../../services/KeyWordService";
import consts from "../../consts";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import Modal from "../UI/Modal";
import style from "../style/Articles.module.css";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import TextEditor from "../UI/TextEditor";
import {ArticlePageService} from "../../services/ArticlePageService";
import {IArticlePageUpdateModel} from "../../types/IArticlePageUpdateModel";

const ArticlePageUpdatePage = () => {
    const [articlePage, setArticlePage] = useState({} as IArticlePageUpdateModel)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(()=>{
        fetchArticlePage()
    },[])

    const fetchArticlePage = async ()=>{
        // @ts-ignore
        const response = await ArticlePageService.GetArticlePageForUpdate(params.articlePageId)
        try{
            setArticlePage(response.data)
        }catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false)
        }

    }
    //изменить страницу
    const updateArticlePage = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        try{
            const res = await ArticlePageService.UpdateArticlePage(articlePage)
            console.log(res.data)
            alert("Статья сохранена")
            navigate(consts.ARTICLE_NAVIGATION_ROUTE+"/"+params.articleId+"/"+params.articlePageId)

        }catch (e) {
            console.log(e)
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

                            <div className={global.pageArticle}>редактирование страницы статьи</div>
                            <div>внестие изменения в текст страницы:</div>

                            <div><TextEditor text={articlePage.text} setText={(newText)=>{
                                setArticlePage({...articlePage, text: newText})
                            }
                            }/></div>

                            <button onClick={updateArticlePage}>сохранить изменения</button>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default ArticlePageUpdatePage;