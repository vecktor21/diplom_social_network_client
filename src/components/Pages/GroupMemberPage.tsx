import React, {useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {useSearchParams} from "react-router-dom";
import {UserShortViewModel} from "../../types/UserShortViewModel";
import UserComponent from "../UserComponent";
import {BanService} from "../../services/BanService";
import GroupService from "../../services/GroupService";
import {ReactComponent as Ban} from "../assets/ban-icon.svg";

const GroupMemberPage = () => {
    const [params] = useSearchParams()
    const id = Number(params.get("groupId"))
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [members, setMembers]=useState([] as UserShortViewModel[])
    useEffect(()=>{
      fetchMembers()
    },[])
    const fetchMembers = async()=>{
        try{
            if(!id){
                setIsError(true)
                setIsLoading(false)
                return;
            }
            const res = await GroupService.GetGroupMembers(Number(id))
            console.log(res.status)
            setMembers(res.data)

        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }
    const banHandler = async(userId:number)=>{
        BanService.GroupBanUser(userId,id,"",null)
    }
    return (
        <div className={global.pageContent}>
            {isLoading
                ?

                <LoadingComponent/>
                :
                isError
                    ?
                    <ErrorComponent/>
                    :
                    <div className={global.mainSection}>
                        <div className={global.pageArticle}>Участники группы</div>
                        {members.map(x=>
                            <UserComponent user={x} key={x.userId}>
                                <Ban onClick={(e)=>{
                                    e.stopPropagation()
                                    banHandler(x.userId)
                                }} className={global.ban}/>
                            </UserComponent>
                        )}
                    </div>
            }
        </div>
    );
};

export default GroupMemberPage;
