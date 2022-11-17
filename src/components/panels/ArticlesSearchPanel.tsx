import React, {useState} from 'react';
import style from '../style/Articles.module.css'
import {IArticle} from "../../types/IArticle";
import ArticleObjectComponent from "../ArticleObjectComponent";
import ArticlesService from "../../services/ArticlesService";
import {observer} from "mobx-react-lite";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
const ArticlesSearchPanel = observer(() => {
    const [searchText, setSearchText] = useState("")
    const [articles, setArticles] = useState([] as IArticle[])
    const [isLoading, setIsLoading] = useState(false)

    const searchArticles = ()=>{
        setIsLoading(true)
        const text = searchText.replace(".", "").replace(",", "")
        const keywords = searchText.split(" ")
        const searchResponse = ArticlesService.SearchArticles(text, keywords)
        setArticles(searchResponse)
        setIsLoading(false)
    }
    return (
        <div>
            <div className={global.pageArticle}>Поиск статей</div>
            <div className={global.searchBlockInSection + " " + global.searchBlock}>
                <Logo id="find" className={global.find} onClick={searchArticles}/>
                <input
                    value={searchText}
                    placeholder={"поиск"}
                    onChange={(e)=>{setSearchText(e.target.value)}}
                    onKeyDown={(e)=>{
                        if(e.key.toLowerCase()=="enter"){
                            searchArticles()
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
                                    <ArticleObjectComponent article={a} key={a.ArticleId}></ArticleObjectComponent>
                                )}
                            </div>
                    }
                </div>
            }
        </div>
    );
});

export default ArticlesSearchPanel;