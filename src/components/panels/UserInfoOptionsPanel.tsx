import React, {useContext, useEffect, useState} from 'react';
import style from "../style/Articles.module.css";
import {IArticle} from "../../types/IArticle";
import {Context} from "../../index";
import ArticlesService from "../../services/ArticlesService";
import ArticleObjectComponent from "../ArticleObjectComponent";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import global from "../style/Global.module.css";
import UserService from "../../services/UserService";
import {IUser} from "../../types/IUser";
import {IUserInfo} from "../../types/IUserInfo";
import {IUserInfoPrivacyType} from "../../types/IUserInfoPrivacyType";
import {ICountry} from "../../types/ICountry";
import {CountryService} from "../../services/CountryService";

const UserInfoOptionsPanel = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [countries, setCountries]=useState([] as ICountry[])
    const [userInfo, setUserInfo] = useState({
        age:0,
        dateOfBirth:new Date(),
        status:"",
        userId:0,
        userInfoId:0,
        userInfoPrivacyType:{}  as IUserInfoPrivacyType,
        education:"",
        city:"",
        country:{}as ICountry
    } as IUserInfo)
    const {userStore} = useContext(Context)
    useEffect(()=>{
        if(!userStore?._isAuth){
            setIsError(true)
        }
        fetchUserInfo()
        fetchCountries()
    },[])
    const fetchUserInfo = async()=>{
        try{
            // @ts-ignore
            const response = await UserService.GetUserInfo(userStore?.user.userId,0)
            setUserInfo(response)

        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }

    const fetchCountries = async()=>{
        try{
            // @ts-ignore
            const response = await CountryService.GetCountries()
            setCountries(response)

        }catch (e) {
            setIsError(true)
            console.log(e)
        }
        setIsLoading(false)
    }

    const saveHandler = async ()=>{
        console.log(userInfo)
        try{
            const response = await UserService.ChangeUserInfo(userInfo)
            window.alert("изменение завершено")

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
                    ?
                    <ErrorComponent/>
                    :
                    <div>
                        <div className={global.pageArticle}>Личная информация</div>
                        <div>
                            {/*изменение страны*/}
                            <div>
                                <label
                                    htmlFor="country">Страна</label>
                                <select
                                    value={userInfo.country.countryID}
                                    id="country"
                                    onChange={(e) => {
                                        setUserInfo({...userInfo,
                                                country:countries.filter(x=>x.countryID==Number(e.target.value))[0]
                                            })
                                    }}
                                >
                                    {countries.map(c=>
                                        <option key={c.countryID} value={c.countryID} >{c.countryNameRu}</option>
                                    )}

                                </select>
                            </div>
                            {/*изменение города*/}
                            <div>
                                <label htmlFor="city">Город</label>
                                <input type="text" id={"city"} value={userInfo.city} onChange={(e)=>{setUserInfo({...userInfo, city:e.target.value})}}/>
                            </div>
                            {/*изменение возраста*/}
                            <div>
                                <label htmlFor="age">Возраст</label>
                                <input type="number" id={"age"} value={userInfo.age} onChange={(e)=>{setUserInfo({...userInfo, age:Number(e.target.value)})}}/>
                            </div>
                            {/*дата рождения*/}
                            <div>
                                <label
                                    htmlFor="date">Дата рождения</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={
                                        `${userInfo.dateOfBirth.getFullYear()}-${userInfo.dateOfBirth.getMonth()+1}-${userInfo.dateOfBirth.getDate()}`
                                    }
                                    onChange={(e) => {
                                        setUserInfo({...userInfo, dateOfBirth: new Date(e.target.value)})
                                    }}/>
                            </div>
                            {/*изменение образования*/}
                            <div>
                                <label htmlFor="educ">Образование</label>
                                <input type="text" id={"educ"} value={userInfo.education} onChange={(e)=>{setUserInfo({...userInfo, education:e.target.value})}}/>
                            </div>
                            {/*изменение статус*/}
                            <div>
                                <label htmlFor="status">Статус</label>
                                <input type="text" id={"status"} value={userInfo.status} onChange={(e)=>{setUserInfo({...userInfo, status:e.target.value})}}/>
                            </div>
                            <label
                                htmlFor="publicPage">кто может видеть личную информацию</label>
                            <select
                                value={userInfo.userInfoPrivacyType.userInfoPrivacyTypeId}
                                id="publicPage"
                                onChange={(e) => {
                                    setUserInfo({...userInfo,
                                            userInfoPrivacyType:
                                                {
                                                    userInfoPrivacyTypeName:"",
                                                    userInfoPrivacyTypeId: Number(e.target.value)
                                                }
                                        })
                                }}>
                                <option value={1} >Все</option>
                                <option value={2} >Никто</option>
                                <option value={3} >Только друзья</option>
                            </select>
                        </div>
                        <button onClick={saveHandler}>сохранить</button>
                    </div>

            }
        </div>
    );
};

export default UserInfoOptionsPanel;