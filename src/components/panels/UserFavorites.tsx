import React, {FC, useContext, useEffect, useState} from 'react';
import style from "../style/Articles.module.css";
import {IArticle} from "../../types/IArticle";
import {Context} from "../../index";
import ArticlesService from "../../services/ArticlesService";
import ArticleObjectComponent from "../ArticleObjectComponent";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import global from "../style/Global.module.css";
import {IUser} from "../../types/IUser";
import UserService from "../../services/UserService";
import consts from "../../consts";
import {Size} from "../../types/Size";
import ProfileImage from "../UI/ProfileImage";
import FileService from "../../services/FileService";
import UserInfoOptionsPanel from "./UserInfoOptionsPanel";
import BannedUsersPanel from "./BannedUsersPanel";
import UserOptionsPanel from "./UserOptionsPanel";
import FavoriteGroupsPanel from "./FavoriteGroupsPanel";
import FavoriteArticlesPanel from "./FavoriteArticlesPanel";
import FavoritePostsPanel from "./FavoritePostsPanel";
const UserFavorites= () => {
    const {userStore} = useContext(Context)
    const [selectedSection, setSelectedSection] = useState(1)

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        fetchData()
    },[])



    const fetchData = async()=>{
        try{

        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
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
                    <div className={global.pageArticle}>Избранное</div>
                        <div className={global.mainSection + " " + style.mainSection} style={{display:"flex", flexDirection:"column"}}>
                            <ul className={style.navbar + " " + style.horizontalNavbar}>
                                <li id={'1'} onClick={(e)=>{setSelectedSection(1)}} className={`${selectedSection==1?style.selected:""}`}>Группы</li>
                                <li id={'2'} onClick={(e)=>{setSelectedSection(2)}} className={`${selectedSection==2?style.selected:""}`}>Статьи</li>
                                <li id={'3'} onClick={(e)=>{setSelectedSection(3)}} className={`${selectedSection==3?style.selected:""}`}>Посты</li>
                            </ul>
                            <div className={style.content}>

                                {(()=>{
                                    switch (selectedSection) {
                                        case 2:
                                            return <FavoriteArticlesPanel/>
                                        case 3:
                                            return <FavoritePostsPanel/>
                                        default:
                                            return <FavoriteGroupsPanel/>
                                    }
                                })()}
                            </div>
                        </div>
                </div>
            }
        </div>
    );
};

export default UserFavorites;
