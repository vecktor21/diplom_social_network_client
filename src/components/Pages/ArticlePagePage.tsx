import React, {useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {IArticlePage} from "../../types/IArticlePage";
import {ArticlePageService} from "../../services/ArticlePageService";
import {useParams} from "react-router-dom";
import parse from 'html-react-parser';
import style from "../style/Articles.module.css";

const ArticlePagePage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [articlePage, setArticlePage] = useState({} as IArticlePage)
    const params = useParams()

    useEffect(()=>{
        fetchArticlePage()
    }, [])
    const fetchArticlePage = async ()=>{
        try{
            const res = await ArticlePageService.GetArticlePage(Number(params.articlePageId))
            setArticlePage(res.data)

        }catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {
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
                            <div className={style.articleTextBlock}>
                                {
                                    parse(articlePage.text)
                                }
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default ArticlePagePage;