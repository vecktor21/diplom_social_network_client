import React, {ReactNode, useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";

import style from '../style/Articles.module.css'
import ArticlesSearchPanel from "../panels/ArticlesSearchPanel";
import ArticlesRecommendedPanel from "../panels/ArticlesRecommendedPanel";
import ArticlesMyArticlesPanel from "../panels/ArticlesMyArticlesPanel";
import ArticlesMyInterestsPanel from "../panels/ArticlesMyInterestsPanel";
import {observer} from "mobx-react-lite";
import {IFavorite} from "../../types/IFavorite";
import UserService from "../../services/UserService";
import {Context} from "../../index";
const ArticlesPage = observer(() => {
    const [selectedSection, setSelectedSection] = useState(1)
    const {userStore} = useContext(Context)
    useEffect(()=>{

    },[])
    return (
        <div className={global.pageContent}>
            <div className={global.pageArticle}>
                Статьи
            </div>
            <div className={global.mainSection + " " + style.mainSection}>
                <ul className={style.navbar}>
                    <li id={'1'} onClick={(e)=>{setSelectedSection(1)}} className={`${selectedSection==1?style.selected:""}`}>Поиск статей</li>
                    <li id={'2'} onClick={(e)=>{setSelectedSection(2)}} className={`${selectedSection==2?style.selected:""}`}>Рекомендации</li>
                    <li id={'3'} onClick={(e)=>{setSelectedSection(3)}} className={`${selectedSection==3?style.selected:""}`}>Мои статьи</li>
                    <li id={'4'} onClick={(e)=>{setSelectedSection(4)}} className={`${selectedSection==4?style.selected:""}`}>Мои интересы</li>
                </ul>
                <div className={style.content}>

                    {(()=>{
                        switch (selectedSection) {
                            case 2:
                                return <ArticlesRecommendedPanel/>
                            case 3:
                                return <ArticlesMyArticlesPanel/>
                            case 4:
                                return <ArticlesMyInterestsPanel/>
                            default:
                                return <ArticlesSearchPanel/>
                        }
                    })()}
                </div>
            </div>
        </div>
    );
});

export default ArticlesPage;
