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
import {IGroup} from "../../types/IGroup";
import GroupService from "../../services/GroupService";
import GroupComponent from "../GroupComponent";
import {log} from "util";

interface Props{
    searchText:string
}

const SearchedGroupsPanel:FC<Props>= (props) => {
    const {userStore} = useContext(Context)
    const [groups, setGroups] = useState([] as IGroup[])
    const [isError, setIsError] = useState(false)
    const [pagination, setPagination] = useState({} as IPaginationParams)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore,setHasMore] = useState(true)
    useEffect(()=>{
        console.log("here")
        searchGroups(1)
    },[])

    const searchGroups = async (page:number)=>{
        setIsLoading(true)
        try{
            console.log("here1")
            const searchResponse = await GroupService.FindGroups(props.searchText,page,1)
            console.log(searchResponse.status)
            if(searchResponse.data.values.length==0) setHasMore(false)
            setGroups([...groups,...searchResponse.data.values] )
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
                        groups.map(a=>
                            <GroupComponent Group={a} key={a.groupId}/>
                        )
                    }
                    {hasMore
                        ?
                        <button onClick={()=>{searchGroups(pagination.page+1)}}>Показать еще</button>
                        :
                        null
                    }
                </div>
            }
        </div>
    );
};

export default SearchedGroupsPanel;
