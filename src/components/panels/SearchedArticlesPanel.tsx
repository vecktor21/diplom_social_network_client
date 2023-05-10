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
import {IPaginationParams} from "../../types/IPaginationParams";

interface Props{
    searchText:string
}

const SearchedArticlesPanel:FC<Props>= (props) => {
    const {userStore} = useContext(Context)
    const [articles, setArticles] = useState([] as IArticle[])
    const [isError, setIsError] = useState(false)
    const [pagination, setPagination] = useState({} as IPaginationParams)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore,setHasMore] = useState(true)
    useEffect(()=>{
        searchArticles(1)
    },[])

    const searchArticles = async (page:number)=>{
        setIsLoading(true)
        try{
            const searchResponse = await ArticlesService.SearchArticles(props.searchText,page,1)
            console.log(searchResponse.status)
            if(searchResponse.data.values.length==0) setHasMore(false)
            setArticles([...articles,...searchResponse.data.values] )
            setPagination(searchResponse.data.paginationParams)
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
                    {hasMore
                        ?
                        <button onClick={()=>{searchArticles(pagination.page+1)}}>Показать еще</button>
                        :
                        null
                    }
                </div>
            }
        </div>
    );
};

export default SearchedArticlesPanel;
