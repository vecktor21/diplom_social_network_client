import React, {FC, ReactNode, useState} from 'react';
import Modal from "./Modal";
import LoadingComponent from "./LoadingComponent";
import ErrorComponent from "./ErrorComponent";
import global from "../style/Global.module.css";
import style from "../style/Articles.module.css";
import UserInfoOptionsPanel from "../panels/UserInfoOptionsPanel";
import BannedUsersPanel from "../panels/BannedUsersPanel";
import UserFavorites from "../panels/UserFavorites";
import UserOptionsPanel from "../panels/UserOptionsPanel";
import GroupOptionsPanel from "../panels/GroupOptionsPanel";
import {IGroup} from "../../types/IGroup";
import BannedUsersGroupPanel from "../panels/BannedUsersGroupPanel";

interface Props{
    isVisible: boolean,
    setIsVisible: (value: boolean)=>void,
    isAdmin:boolean,
    group:IGroup
}
const GroupEditModal : FC<Props>= (props) => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSection, setSelectedSection] = useState(1)
    return (
        <Modal isVisible={props.isVisible} setIsVisible={props.setIsVisible}>
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
                                <li id={'1'} onClick={(e)=>{setSelectedSection(1)}} className={`${selectedSection==1?style.selected:""}`}>Информация о группе</li>
                                <li id={'2'} onClick={(e)=>{setSelectedSection(2)}} className={`${selectedSection==2?style.selected:""}`}>Заблокированные пользователи</li>
                            </ul>
                            <div className={style.content}>

                                {(()=>{
                                    switch (selectedSection) {
                                        case 2:
                                            return <BannedUsersGroupPanel group={props.group}/>
                                        default:
                                            return <GroupOptionsPanel group={props.group}/>
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
            }
        </Modal>
    );
};

export default GroupEditModal;
