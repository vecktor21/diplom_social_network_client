import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import UserService from "../../services/UserService";
import global from "../style/Global.module.css";
import style from "../style/Articles.module.css";
import ArticlesRecommendedPanel from "../panels/ArticlesRecommendedPanel";
import ArticlesMyArticlesPanel from "../panels/ArticlesMyArticlesPanel";
import ArticlesMyInterestsPanel from "../panels/ArticlesMyInterestsPanel";
import ArticlesSearchPanel from "../panels/ArticlesSearchPanel";
import UserInfoOptionsPanel from "../panels/UserInfoOptionsPanel";
import BannedUsersPanel from "../panels/BannedUsersPanel";
import UserOptionsPanel from "../panels/UserOptionsPanel";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import UserFavorites from "../panels/UserFavorites";

const UserOptionsPage = () => {
    const [selectedSection, setSelectedSection] = useState(1)
    const {userStore} = useContext(Context)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{

    },[])
    return (
        <div className={global.pageContent}>
            {isLoading
            ?
                <LoadingComponent/>
            :
                isError
                    ?<ErrorComponent/>
                    :
                    <div>
                        <div className={global.pageArticle}>
                            Параметры
                        </div>
                        <div className={global.mainSection + " " + style.mainSection}>
                            <ul className={style.navbar}>
                                <li id={'1'} onClick={(e)=>{setSelectedSection(1)}} className={`${selectedSection==1?style.selected:""}`}>Общая информация</li>
                                <li id={'2'} onClick={(e)=>{setSelectedSection(2)}} className={`${selectedSection==2?style.selected:""}`}>Личная информация</li>
                                <li id={'3'} onClick={(e)=>{setSelectedSection(3)}} className={`${selectedSection==3?style.selected:""}`}>Пользователи в черном списке</li>
                                <li id={'4'} onClick={(e)=>{setSelectedSection(4)}} className={`${selectedSection==4?style.selected:""}`}>Избранное</li>
                            </ul>
                            <div className={style.content}>

                                {(()=>{
                                    switch (selectedSection) {
                                        case 2:
                                            return <UserInfoOptionsPanel/>
                                        case 3:
                                            return <BannedUsersPanel/>
                                        case 4:
                                            return <UserFavorites/>
                                        default:
                                            return <UserOptionsPanel/>
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
};

export default UserOptionsPage;
