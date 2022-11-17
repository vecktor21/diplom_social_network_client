import React, {useContext, useEffect, useState} from 'react';
import {ReactComponent as NotificationIcon} from './assets/notification-icon.svg'
import global from "./style/Global.module.css";
import style from "./style/Notifications.module.css";
import {NavLink} from "react-router-dom";
import routes from "../consts";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {IFriendRequest} from "../types/IFriendRequest";
import {FriendsService} from "../services/FriendsService";
import {IFriendRequestResponse} from "../types/IFriendRequestResponse";
import NotificationComponent from "./UI/NotificationComponent";
import GroupService from "../services/GroupService";
import {IRequestToGroup} from "../types/IRequestToGroup";
import LoadingComponent from "./UI/LoadingComponent";

const Notifications = observer(() => {
    const {userStore} = useContext(Context)
    const [friendRequests, setFriendRequests] = useState([] as IFriendRequestResponse[])
    const [isLoading, setIsLoading] = useState(true)
    const [groupRequests, setGroupRequests] = useState([] as IRequestToGroup[])
    useEffect(()=>{
        loadNotifs()
    },[])

    const loadNotifs = ()=>{
        if(userStore?.user.userId){
            FriendsService.GetFriendRequests(userStore?.user.userId)
                .then(res=>{
                    setIsLoading(false)
                    setFriendRequests(res.data)
                })
                .catch(e=>{
                    setIsLoading(false)
                })
            GroupService.GetRequestsToGroupByUserId(userStore?.user.userId)
                .then(res=>{
                    setIsLoading(false)
                    setGroupRequests(res.data)
                })
                .catch(e=>{
                    setIsLoading(false)
                })
        }
    }



    const answerToFriendRequest = (res: boolean, requestID: number)=>{
        setIsLoading(true)
        FriendsService.AnswerToFriendRequest(res, requestID)
            .then(res=>{
                setIsLoading(false)
            })
            .catch(e=>{
                setIsLoading(false)
            })
    }

    const answerToGroupRequest = (userId: number, groupId: number, isAccepted: boolean )=>{
        setIsLoading(true)
        GroupService.ReactToRequest(userId, groupId, isAccepted)
            .then(res=>{
                setIsLoading(false)
            })
            .catch(e=>{
                setIsLoading(false)
            })
    }


    return (
        <ul className={style.notificationsDropdown}>
            <li className={style.notifications}>
                <NotificationIcon id="settings" className={global.notificationsIcon}/>
                {friendRequests.length + groupRequests.length == 0
                    ?
                    ''
                    :
                    <div className={style.notificationsIconNumber}>{friendRequests.length + groupRequests.length}</div>
                }
            </li>
            <li>
                {
                    isLoading
                    ?
                        <LoadingComponent/>
                    :
                        <ul className={style.notificationsDropdownSub}>
                            {friendRequests.map(req=>
                                <li key={req.requestID}>
                                    <NotificationComponent>
                                        <div>
                                            новый запрос в друзья от
                                            <NavLink to={routes.USER_PAGE_ROUTE + "?id="+req.sender.userId}>{req.sender.name}</NavLink>:
                                        </div>
                                        <div>
                                            {req.message}
                                        </div>
                                        <div>
                                            <button className={style.accept} onClick={()=>{answerToFriendRequest(true, req.requestID)}}>принять</button>
                                            <button className={style.decline} onClick={()=>{answerToFriendRequest(false, req.requestID)}}>отклонить</button>
                                        </div>
                                    </NotificationComponent>
                                </li>
                            )}
                            {groupRequests.map(req=>
                                <li key={req.requestId}>
                                    <NotificationComponent>
                                        <div>
                                            новый запрос на вступление в группу от
                                            <NavLink to={routes.USER_PAGE_ROUTE + "?id="+req.userId}>{req.userNickname}</NavLink>:
                                        </div>
                                        <div>
                                            <button className={style.accept} onClick={()=>{answerToGroupRequest(req.userId, req.groupId, true)}}>принять</button>
                                            <button className={style.decline} onClick={()=>{answerToGroupRequest(req.userId, req.groupId, false)}}>отклонить</button>
                                        </div>
                                    </NotificationComponent>
                                </li>
                            )}
                        </ul>

                }
            </li>
        </ul>
    );
});

export default Notifications;