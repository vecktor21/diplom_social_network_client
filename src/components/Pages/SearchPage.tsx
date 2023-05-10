import React, {useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import postStyle from "../style/Post.module.css";
import {useSearchParams} from "react-router-dom";
import style from "../style/Articles.module.css";
import FavoriteArticlesPanel from "../panels/FavoriteArticlesPanel";
import FavoritePostsPanel from "../panels/FavoritePostsPanel";
import FavoriteGroupsPanel from "../panels/FavoriteGroupsPanel";
import SearchedArticlesPanel from "../panels/SearchedArticlesPanel";
import SearchedGroupsPanel from "../panels/SearchedGroupsPanel";
import SearchedUsersPanel from "../panels/SearchedUsersPanel";

const SearchPage = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchParams] = useSearchParams()
    let search = searchParams.get("search")
    const [selectedSection, setSelectedSection] = useState(1)
    useEffect(()=>{
        if (!search){
            setIsError(true)
        }
        setIsLoading(false)
    },[])
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
                        <div className={postStyle.post} style={{marginTop: "20px"}}>
                            <div className={global.pageArticle}>поиск</div>
                            <div className={global.mainSection + " " + style.mainSection} style={{display:"flex", flexDirection:"column"}}>
                                <ul className={style.navbar + " " + style.horizontalNavbar}>
                                    <li id={'1'} onClick={(e)=>{setSelectedSection(1)}} className={`${selectedSection==1?style.selected:""}`}>Группы</li>
                                    <li id={'2'} onClick={(e)=>{setSelectedSection(2)}} className={`${selectedSection==2?style.selected:""}`}>Статьи</li>
                                    <li id={'3'} onClick={(e)=>{setSelectedSection(3)}} className={`${selectedSection==3?style.selected:""}`}>Люди</li>
                                </ul>
                                <div className={style.content}>

                                    {(()=>{
                                        switch (selectedSection) {
                                            case 2:
                                                // @ts-ignore
                                                return <SearchedArticlesPanel searchText={search}/>
                                            case 3:
                                                // @ts-ignore
                                                return <SearchedUsersPanel searchText={search}/>
                                            default:
                                                // @ts-ignore
                                                return <SearchedGroupsPanel searchText={search}/>
                                        }
                                    })()}
                                </div>
                            </div>
                        </div>
                    }
                </div>

            }
        </div>
    );
};

export default SearchPage;
