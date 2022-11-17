import React, {FC, useContext, useState} from 'react';
import Modal from "./UI/Modal";
import {observer} from "mobx-react-lite";
import {ICreateGroupModel} from "../types/ICreateGroupModel";
import {Context} from "../index";
import GroupService from "../services/GroupService";

interface Props {
    isVisible: boolean,
    setIsVisible: (bool: boolean)=>void
}

const GroupCreateModalComponent :FC<Props> = observer((props) => {
    const {userStore} = useContext(Context)
    const [createGroupModel, setCreateGroupModel] = useState({
        isPublic: true,
        groupName: "название группы",
        adminId: userStore?.user.userId

    } as ICreateGroupModel)
    const createGroup = ()=>{
        GroupService.CreateGroup(createGroupModel)
            .then(res=>{
                console.log(res.data)
                alert("группа успешно создана ")
                props.setIsVisible(false)
            })
            .catch(e=>{
                alert("при создании группы произошла ошибка. попробуйте еще раз")
            })
    }
    return (
        <Modal isVisible={props.isVisible} setIsVisible={props.setIsVisible}>
            <div>
                создание группы
            </div>
            <div>
                <label htmlFor="name">введите название группы</label>
                <input
                    type="text"
                    id="name"
                    value={createGroupModel.groupName}
                    onChange={(e)=>
                    {
                        setCreateGroupModel({...createGroupModel, groupName: e.target.value})
                    }}
                />
            </div>
            <label >желаете сделать группу публичной?</label>
            <div>
                <label htmlFor="false">нет</label>
                <input type="radio"
                        id={"false"}
                        name="isPublic"
                        onChange={(e)=>
                        {
                            setCreateGroupModel({...createGroupModel, isPublic: false})
}}
                />
                <label htmlFor="true">да</label>
                <input type="radio"
                        id={"true"}
                        name="isPublic"
                        checked={true}
                        onChange={(e)=>
                        {
                            setCreateGroupModel({...createGroupModel, isPublic: true})
}}
                />
            </div>
            <button onClick={createGroup}>создать группу</button>
        </Modal>
    );
});

export default GroupCreateModalComponent;