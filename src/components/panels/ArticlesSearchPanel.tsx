import React, {useState} from 'react';
import style from '../style/Articles.module.css'
import {IArticle} from "../../types/IArticle";
import ArticleObjectComponent from "../ArticleObjectComponent";
import ArticlesService from "../../services/ArticlesService";
import {observer} from "mobx-react-lite";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import {IPaginationParams} from "../../types/IPaginationParams";
import PagesPaginationComponent from "../UI/PagesPaginationComponent";
const ArticlesSearchPanel = observer(() => {
    const [searchText, setSearchText] = useState("")
    const [articles, setArticles] = useState([] as IArticle[])
    const [pagination, setPagination] = useState({} as IPaginationParams)
    const [isLoading, setIsLoading] = useState(false)

    const searchArticles = async (page:number)=>{
        setIsLoading(true)
        try{
            const searchResponse = await ArticlesService.SearchArticles(searchText,page,3)
            console.log(searchResponse.status)
            setArticles(searchResponse.data.values)
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
            <div className={global.pageArticle}>Поиск статей</div>
            <div className={global.searchBlockInSection + " " + global.searchBlock}>
                <Logo id="find" className={global.find} onClick={()=>{searchArticles(1)}}/>
                <input
                    value={searchText}
                    placeholder={"поиск"}
                    onChange={(e)=>{setSearchText(e.target.value)}}
                    onKeyDown={(e)=>{
                        if(e.key.toLowerCase()=="enter"){
                            searchArticles(1)
                        }
                    }}
                />
            </div>
            {searchText==""
                ?
                <div>начните вводить текст чтобы найти статьи</div>
                :
                <div>
                    {
                        isLoading
                            ?

                            <LoadingComponent/>
                            :
                            <div>
                                {articles.map(a=>
                                    <ArticleObjectComponent article={a} key={a.articleId}></ArticleObjectComponent>
                                )}
                                <PagesPaginationComponent
                                    totalPages={pagination.totalPages}
                                    currentPage={pagination.page}
                                    onPageClick={searchArticles}/>
                            </div>
                    }
                </div>
            }
        </div>
    );
});

export default ArticlesSearchPanel;
