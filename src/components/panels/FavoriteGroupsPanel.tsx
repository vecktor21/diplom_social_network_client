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
import {IGroup} from "../../types/IGroup";
import FavoriteService from "../../services/FavoriteService";
import GroupComponent from "../GroupComponent";

const FavoriteGroupsPanel= () => {
    const {userStore} = useContext(Context)
    const [groups, setGroups] = useState([] as IGroup[])
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{
        fetchBanList()
    },[])
    const fetchBanList = async()=>{
        try{
            if(!userStore?.user){
                setIsError(true)
                return
            }
            const res = await FavoriteService.GetFavoriteGroups(userStore?.user.userId)
            setGroups(res)

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
                <div style={{display:"flex"}}>
                    {
                        groups.map(g=>
                            <GroupComponent Group={g} key={g.groupId}/>
                        )
                    }
                </div>
            }
        </div>
    );
};

export default FavoriteGroupsPanel;
