import React, {useContext, useEffect, useState} from 'react';
import {IArticleCreateModel} from "../../types/IArticleCreateModel";
import {IKeyWord} from "../../types/IKeyWord";
import {Context} from "../../index";
import KeyWordService from "../../services/KeyWordService";
import ArticlesService from "../../services/ArticlesService";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import Modal from "../UI/Modal";
import style from "../style/Articles.module.css";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import TextEditor from "../UI/TextEditor";
import {useNavigate, useParams} from "react-router-dom";
import {IArticlePageCreateModel} from "../../types/IArticlePageCreateModel";
import {ArticlePageService} from "../../services/ArticlePageService";
import consts from "../../consts";

const ArticlePageCreatePage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const [isError, setIsError] = useState(false)
    const [newArticlePage, setNewArticlePage] = useState({articleId: 0, text: ""} as IArticlePageCreateModel)
    const {userStore} = useContext(Context)

    useEffect(()=>{
        if(userStore?.user.userId){
            setNewArticlePage({...newArticlePage, articleId: Number(params.articleId)})
        }
    }, [])


    //создать страницу
    const createArticlePage = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        try{

            const res = await ArticlePageService.CreateArticlePage(newArticlePage)
            console.log(res.data)
            alert("страница создана")
            navigate(`${consts.ARTICLE_NAVIGATION_ROUTE}/${params.articleId}`)
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

                            <div className={global.pageArticle}>создание страницы для статьи</div>
                            <div>напишите текст страницы:</div>

                            <div><TextEditor text={newArticlePage.text} setText={(newText)=>{
                                setNewArticlePage({...newArticlePage, text: newText})
                            }
                            }/></div>

                            <button onClick={createArticlePage}>создать</button>
                        </div>

                    }
                </div>
            }
        </div>
    );
};

export default ArticlePageCreatePage;