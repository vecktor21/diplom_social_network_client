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
interface Props{
    group:IGroup
}
const BannedUsersGroupPanel :FC<Props>= (props) => {
    const {userStore} = useContext(Context)
    const [banList, setBanList] = useState([] as IBannedUser[])
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{
        fetchBanList()
    },[])
    const fetchBanList = async()=>{
        try{
            if(!userStore?.user.userId){
                setIsError(true)
                setIsLoading(false)
                return;
            }
            const res = await BanService.GetGroupBans(props.group.groupId)
            console.log(res)
            setBanList(res)

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
                    <div className={global.pageArticle}>Пользователи в черном списке</div>
                    <div>
                        {banList.length==0
                        ?
                            <div>Черный список пуст</div>
                        :
                            banList.map(x=>
                                <BannedUserComponent groupId={props.group.groupId} BannedUser={x} key={x.blockedUserId} setIsLoading={setIsLoading} setIsError={setIsError}/>
                            )
                        }

                    </div>
                </div>
            }
        </div>
    );
};

export default BannedUsersGroupPanel;
