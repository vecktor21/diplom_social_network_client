import React, {useEffect, useState} from 'react';
import {IArticle} from "../../types/IArticle";
import ArticlesService from "../../services/ArticlesService";
import {useParams} from "react-router-dom";
import global from "../style/Global.module.css";

const ArticlePage = () => {
    const [article, setArticle] = useState({} as IArticle)
    const params = useParams()
    useEffect(()=>{
        const articleResponse = ArticlesService.GetArticle(1)
        setArticle(articleResponse)
    },[])
    return (
        <div className={global.pageContent}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam, commodi debitis et in ipsum itaque, labore laborum magni minima modi possimus sapiente veritatis voluptas voluptatem. Incidunt odit pariatur quia.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam, commodi debitis et in ipsum itaque, labore laborum magni minima modi possimus sapiente veritatis voluptas voluptatem. Incidunt odit pariatur quia.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam, commodi debitis et in ipsum itaque, labore laborum magni minima modi possimus sapiente veritatis voluptas voluptatem. Incidunt odit pariatur quia.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aperiam, commodi debitis et in ipsum itaque, labore laborum magni minima modi possimus sapiente veritatis voluptas voluptatem. Incidunt odit pariatur quia.
            Article
            <p style={{color: "red"}}>
                s
            </p>
            article: {params.articleId}
            page: {params.page}
        </div>
    );
};

export default ArticlePage;