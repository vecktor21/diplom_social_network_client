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
import {UserShortViewModel} from "../../types/UserShortViewModel";
import {FriendsService} from "../../services/FriendsService";
import UserService from "../../services/UserService";
import UserComponent from "../UserComponent";

interface Props{
    searchText:string
}

const SearchedUsersPanel:FC<Props>= (props) => {
    const {userStore} = useContext(Context)
    const [users, setUsers] = useState([] as UserShortViewModel[])
    const [isError, setIsError] = useState(false)
    const [pagination, setPagination] = useState({} as IPaginationParams)
    const [isLoading, setIsLoading] = useState(false)
    const [hasMore,setHasMore] = useState(true)
    useEffect(()=>{
        searchUsers(1)
    },[])

    const searchUsers = async (page:number)=>{
        setIsLoading(true)
        try{
            const searchResponse = await UserService.FindUsers(props.searchText,page,1)
            console.log(searchResponse.status)
            if(searchResponse.data.values.length==0) setHasMore(false)
            setUsers([...users,...searchResponse.data.values] )
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
                        users.map(x=>
                            <UserComponent user={x} key={x.userId}/>
                        )
                    }
                    {hasMore
                        ?
                        <button onClick={()=>{searchUsers(pagination.page+1)}}>Показать еще</button>
                        :
                        null
                    }
                </div>
            }
        </div>
    );
};

export default SearchedUsersPanel;
