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
import {IGroup} from "../../types/IGroup";
import GroupService from "../../services/GroupService";

interface Props{
    group:IGroup
}
const GroupOptionsPanel:FC<Props> = (props) => {
    const {userStore} = useContext(Context)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newGroupImage, setNewGroupImage] = useState({} as File)
    const [group, setGroup]=useState(props.group)

    useEffect(()=>{


    },[])

    const saveHandler = async ()=>{
        setIsLoading(true)
        setIsError(false)
        console.log(props.group)
        try{
            const response = await GroupService.ChangeInfo(group.groupId, group.groupName,group.isPublic);
            console.log(response.status)
            window.alert("изменение завершено")

        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }

    const saveImageHandler = async()=>{
        setIsLoading(true)
        setIsError(false)
        try{
            const formData = new FormData()
            formData.append("file", newGroupImage)
            const res = await FileService.UploadFile(formData)
            console.log(res.data.fileLink)
            console.log(res.data.logicalName)
            if(!userStore?.user.userId|| !res.data.fileId){
                window.alert("ошибка обработки запроса")
                return;
            }
            await GroupService.ChangeProfileImage(group.groupId, res.data.fileId)
            window.alert("изменение сохранено")
            window.location.reload()

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
                    <div className={global.pageArticle}>Информация о группе</div>
                    <div>
                        <div>
                            <label
                                htmlFor="name">Название группы</label>
                            <input
                                type={"text"}
                                value={group.groupName}
                                id="name"
                                onChange={(e) => {
                                    setGroup({...group,groupName:e.target.value})
                                }}/>
                        </div>
                        <div>
                            <label
                                htmlFor="isPublic">Публичная группа?</label>
                            <input
                                type={"checkbox"}
                                checked={group.isPublic}
                                id="isPublic"
                                onChange={(e) => {

                                    setGroup({...group,isPublic:e.target.checked})
                                }}/>
                        </div>

                        <button onClick={saveHandler}>сохранить изменения</button>
                        <div className={global.pageArticle}>Изображение профиля</div>
                        <ProfileImage src={`${consts.API_URL}/${group.groupImage}`} size={Size.large}/>
                        <ProfileImage src={`${consts.API_URL}/${group.groupImage}`} size={Size.medium}/>
                        <ProfileImage src={`${consts.API_URL}/${group.groupImage}`} size={Size.small}/>
                        <div>
                            <label
                                htmlFor="">Изображение профиля</label>
                            <input
                                type={"file"}
                                id="prof"
                                multiple={false}
                                onChange={(e) => {
                                    if((e?.target?.files)&&(!e.target.files[0].type.includes("image"))){
                                        window.alert("необходимо выбрать изображение")
                                        e.target.value=""
                                    }else{
                                        // @ts-ignore
                                        console.log(e?.target?.files[0])
                                        // @ts-ignore
                                        setNewGroupImage(e?.target?.files[0])
                                    }
                                }}/>
                        </div>
                        <button onClick={saveImageHandler}>сохранить изменения</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default GroupOptionsPanel;
