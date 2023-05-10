import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import UserService from "../../services/UserService";
import global from "../style/Global.module.css";
import {observer} from "mobx-react-lite";
import {IGroup} from "../../types/IGroup";
import GroupComponent from "../GroupComponent";
import LoadingComponent from "../UI/LoadingComponent";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import consts from "../../consts";
import GroupService from "../../services/GroupService";
import GroupCreateModalComponent from "../GroupCreateModalComponent";
import {IPaginationParams} from "../../types/IPaginationParams";
import PagesPaginationComponent from "../UI/PagesPaginationComponent";

const GroupsPage = observer(() => {
    const [params] = useSearchParams()
    const id = Number(params.get("id"))
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [groups, setGroups] = useState([] as IGroup[])
    const [pagination, setPagination] = useState({} as IPaginationParams)
    const [searchText, setSearchText] = useState("")
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [foundGroups, setFoundGroups] = useState([] as IGroup[])
    const navigate = useNavigate()
    const [isGroupCreateModalVisible, setIsGroupCreateModalVisible] = useState(false)

    useEffect(()=>{
        fetchGroups()
    }, [])

    const fetchGroups = async ()=>{
        if(id!=null){
            const response = await UserService.GetUserGroups(id)
            response.data.sort((a, b)=>{
                if(a.groupName<b.groupName){
                    return -1
                }
                else if(a.groupName==b.groupName){
                    return 0
                }
                else{
                    return 1
                }
            })
            setGroups(response.data)
            setIsError(false)
        }else {
            setIsError(true)
        }
        setIsLoading(false)
    }
    const searchGroups = (page:number)=>{
        setIsSearchLoading(true)
        GroupService.FindGroups(searchText,page,4)
            .then(res=>{
                setFoundGroups(res.data.values)
                setPagination(res.data.paginationParams)
                //console.log(data)
                setIsSearchLoading(false)
            })
    }

    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <LoadingComponent/>
                :
                <div className={global.mainSection}>
                    <GroupCreateModalComponent isVisible={isGroupCreateModalVisible} setIsVisible={setIsGroupCreateModalVisible}/>
                    <div className={global.pageArticle}>Ваши группы</div>
                    <div style={{
                        position: "relative"
                    }}>
                        <div className={global.searchBlockInSection + " " + global.searchBlock}>
                            <Logo id="find" className={global.find} onClick={()=>{searchGroups(1)}}/>
                            <input
                                value={searchText}
                                placeholder={"поиск групп"}
                                onChange={(e)=>{setSearchText(e.target.value)}}
                                onKeyDown={(e)=>{
                                    if(e.key.toLowerCase()=="enter"){
                                        searchGroups(1)
                                    }
                                }}
                            />
                        </div>
                        {searchText==""
                            ?
                            <div>начните вводить текст чтобы найти группы</div>
                            :
                            <div>
                                {
                                    isSearchLoading
                                        ?
                                        <LoadingComponent/>
                                        :
                                        <div>
                                            {foundGroups.map(a=>
                                                <GroupComponent Group={a} key={a.groupId}/>
                                            )}
                                            <PagesPaginationComponent
                                                totalPages={pagination.totalPages}
                                                currentPage={pagination.page}
                                                onPageClick={searchGroups}/>
                                        </div>
                                }
                            </div>
                        }

                        <button
                            style={{
                                position: "absolute",
                                right: "20px",
                                top: "0"
                            }}
                            onClick={()=>{setIsGroupCreateModalVisible(true)}}
                        >
                            создать группу
                        </button>
                    </div>
                    {
                        groups.length == 0
                        ?
                            <div  >вы еще не подписаны ни на одну группу. используйте поиск чтобы найти интерисуюущие вас группы</div>
                        :
                            <div className={global.gridView} style={{borderTop:"3px solid #4d6da9", marginTop:"10px"}}>

                                {groups.map(group=>
                                    <GroupComponent Group={group} key={group.groupId}/>
                                )}
                            </div>

                    }
                </div>
            }
        </div>
    );
});

export default GroupsPage;
