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
const UserOptionsPanel= () => {
    const {userStore} = useContext(Context)

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newUserImage, setNewUserImage] = useState({} as File)
    const [user, setUser] = useState({
        login:"",
        surname:"",
        userId:0,
        name:"",
        nickname:"",
        role:"",
        profileImage:"",
        email:""

    } as IUser)

    useEffect(()=>{
        fetchData()
    },[])



    const fetchData = async()=>{
        try{
            // @ts-ignore
            const res = await UserService.GetUser(userStore?.user.userId)
            setUser(res)
            console.log(res)
        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }
    const saveHandler = async ()=>{
        setIsLoading(true)
        setIsError(false)
        console.log(user)
        try{
            const response = await UserService.ChangeUser(user)
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
            formData.append("file", newUserImage)
            const res = await FileService.UploadFile(formData)
            console.log(res.data.fileLink)
            console.log(res.data.logicalName)
            if(!userStore?.user.userId|| !res.data.fileId){
                window.alert("ошибка обработки запроса")
                return;
            }
            await UserService.ChangeProfileImage(userStore?.user.userId, res.data.fileId)
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
                    <div className={global.pageArticle}>Общая инфомация</div>
                    <div>
                        <div>
                            <label
                                htmlFor="name">Имя</label>
                            <input
                                type={"text"}
                                value={user.name}
                                id="name"
                                onChange={(e) => {
                                    setUser({...user,
                                        name:e.target.value
                                    })
                                }}/>
                        </div>
                        <div>
                            <label
                                htmlFor="surname">Фамилия</label>
                            <input
                                type={"text"}
                                value={user.surname}
                                id="surname"
                                onChange={(e) => {
                                    setUser({...user,
                                        surname:e.target.value
                                    })
                                }}/>
                        </div>
                        <div>
                            <label
                                htmlFor="nickname">Никнейм</label>
                            <input
                                type={"text"}
                                value={user.nickname}
                                id="nickname"
                                onChange={(e) => {
                                    setUser({...user,
                                        nickname:e.target.value
                                    })
                                }}/>
                        </div>
                        <div>
                            <label
                                htmlFor="email">Почта</label>
                            <input
                                type={"email"}
                                value={user.email}
                                id="email"
                                onChange={(e) => {
                                    setUser({...user,
                                        email:e.target.value
                                    })
                                }}/>
                        </div>
                        <button onClick={saveHandler}>сохранить изменения</button>
                        <div className={global.pageArticle}>Изображение профиля</div>
                        <ProfileImage src={`${consts.API_URL}/${user.profileImage}`} size={Size.large}/>
                        <ProfileImage src={`${consts.API_URL}/${user.profileImage}`} size={Size.medium}/>
                        <ProfileImage src={`${consts.API_URL}/${user.profileImage}`} size={Size.small}/>
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
                                        setNewUserImage(e?.target?.files[0])
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

export default UserOptionsPanel;
