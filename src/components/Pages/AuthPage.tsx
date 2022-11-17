import React, {useContext, useEffect, useState} from 'react';
import global from '../style/Global.module.css'
import style from '../style/Auth.module.css'
import ArticlesRecommendedPanel from "../panels/ArticlesRecommendedPanel";
import ArticlesMyArticlesPanel from "../panels/ArticlesMyArticlesPanel";
import ArticlesMyInterestsPanel from "../panels/ArticlesMyInterestsPanel";
import ArticlesSearchPanel from "../panels/ArticlesSearchPanel";
import {observer} from "mobx-react-lite";
import {ILoginModel} from "../../types/ILoginModel";
import api from "../../services/AxiosService";
import AuthService from "../../services/AuthService";
import {Context} from "../../index";
import axios, {AxiosError} from "axios";
import {RegisterModel} from "../../types/RegisterModel";
import {ICountry} from "../../types/ICountry";
import {CountryService} from "../../services/CountryService";
import {IUserInfo} from "../../types/IUserInfo";
import {IAuthResponse} from "../../types/IAuthResponse";
import ErrorComponent from "../UI/ErrorComponent";
import LoadingComponent from "../UI/LoadingComponent";

const AuthPage = observer(() => {
    const [isLoading ,setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const [isRegisterError, setIsRegisterError] = useState(false)
    const [registerError, setRegisterError] = useState("")

    const [page, setPage] = useState(0)
    const newUser = new RegisterModel()
    const [loginModel, setLoginModel]=useState({login: "", password: ""} as ILoginModel)
    const [registerModel, setRegisterModel]=useState(newUser)

    const {userStore} = useContext(Context)
    const [countries, setCountries] = useState([] as ICountry[])
    useEffect(()=>{
        const response = CountryService.GetCountries()
        setCountries(response)
        setIsLoading(false)
    },[])
    const test = ()=>{
        if(page==3){
            setPage(0)
        }
        else{
            setPage(page+1)
        }
    }
    const login = ()=>{
        setIsLoading(true)
        console.log("начат вход")
        AuthService.Login(loginModel).then(response=>{
            userStore?.Login(response.data.user)
            //alert("вы вошли")
            setIsLoading(false)
        }).catch((e: AxiosError)=>{
            //alert(e.message)
            console.log("ошибка входа")
            console.log(e)
            setIsError(true)
            setError(e.message)
            setIsLoading(false)
        })
    }
    const register = async()=>{
        setIsLoading(true)
        AuthService.Register(registerModel)
            .then(response=>{
                setIsLoading(false)
                userStore?.Login(response.data.user)
                alert("успешная регистрация")
            })
            .catch(e=>{
                setIsLoading(false)
                setIsRegisterError(true)
                setRegisterError("ошибка регистрации")
                setPage(2)
            })
    }
    return (
        <div className={global.pageContent}>
            {
                isLoading
                    ?
                    <LoadingComponent/>
                    :
                <div>
                    {isError
                    ?
                        <ErrorComponent/>
                    :
                        <div className={style.authBlock}>
                            <div className={style.authContent}>
                                {(()=>{
                                    switch (page) {
                                        //авторизация
                                        case 1:
                                            return <div>
                                                <div>Авторизация</div>
                                                <div>
                                                    <label
                                                        htmlFor="login">логин</label>
                                                    <input
                                                        type="text"
                                                        id="login"
                                                        value={loginModel.login}
                                                        onChange={(e) => {
                                                            setLoginModel({...loginModel, login: e.target.value})
                                                        }}/></div>
                                                <div><label
                                                    htmlFor="password">пароль</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        value={loginModel.password}
                                                        onChange={(e) => {
                                                            setLoginModel({...loginModel, password: e.target.value})
                                                        }}/></div>
                                                <button onClick={login}>Войти</button>
                                                <button onClick={()=>{setPage(2)}}>нет аккаунта? зарегистрируйтесь</button>
                                            </div>
                                        //регистрация и т.п
                                        case 2:
                                            return <div>
                                                {isRegisterError &&
                                                    <b>{registerError}</b>
                                                }
                                                <div>регистрация</div>
                                                <div>для регистрации, заполните следующие обязательные поля:</div>
                                                <div>
                                                    <label
                                                        htmlFor="login">логин</label>
                                                    <input
                                                        type="text"
                                                        id="login"
                                                        value={registerModel.login}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, login: e.target.value})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="email">почта</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={registerModel.email}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, email: e.target.value})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="nickname">Ваш никнейм</label>
                                                    <input
                                                        type="text"
                                                        id="nickname"
                                                        value={registerModel.nickname}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, nickname: e.target.value})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="name">ваше имя</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={registerModel.name}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, name: e.target.value})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="surname">Ваша фамилия</label>
                                                    <input
                                                        type="text"
                                                        id="surname"
                                                        value={registerModel.surname}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, surname: e.target.value})
                                                        }}/></div>
                                                <div><label
                                                    htmlFor="password">пароль</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        value={registerModel.password}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, password: e.target.value})
                                                        }}/></div>
                                                <div><label
                                                    htmlFor="confPassword">пароль</label>
                                                    <input
                                                        type="password"
                                                        id="confPassword"
                                                        value={registerModel.confirmPassword}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, confirmPassword: e.target.value})
                                                        }}/></div>
                                                <button onClick={()=>{setPage(3)}}>далее</button>
                                                <button onClick={()=>{setPage(1)}}>есть аккаунт? авторизация</button>
                                            </div>
                                        //задание дополительной инфы и т.п
                                        case 3:
                                            return <div>
                                                <div>
                                                    <div>заполните информацию о себе (не обязательно)</div>
                                                    <label
                                                        htmlFor="age">Возраст</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        id="age"
                                                        value={registerModel.userInfo.age}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {...registerModel.userInfo, age: Number(e.target.value)}})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="date">Дата рождения</label>
                                                    <input
                                                        type="date"
                                                        id="date"
                                                        value={registerModel.userInfo.dateOfBirth}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {...registerModel.userInfo, dateOfBirth: e.target.value}})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="country">Страна</label>
                                                    <select
                                                        value={registerModel.userInfo.country.countryID}
                                                        id="country"
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {
                                                                    ...registerModel.userInfo,
                                                                    country:
                                                                        {
                                                                            ...registerModel.userInfo.country,
                                                                            countryID: Number(e.target.value)
                                                                        }
                                                                }})
                                                        }}
                                                    >
                                                        {countries.map(c=>
                                                            <option key={c.countryID} value={c.countryID} >{c.countryNameRu}</option>
                                                        )}

                                                    </select>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="city">Город</label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        value={registerModel.userInfo.city}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {...registerModel.userInfo, city: e.target.value}})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="status">статус</label>
                                                    <input
                                                        type="text"
                                                        id="status"
                                                        value={registerModel.userInfo.status}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {...registerModel.userInfo, status: e.target.value}})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="education">образование</label>
                                                    <input
                                                        type="text"
                                                        id="education"
                                                        value={registerModel.userInfo.education}
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {...registerModel.userInfo, education: e.target.value}})
                                                        }}/></div>
                                                <div>
                                                    <label
                                                        htmlFor="publicPage">кто может видеть личную информацию</label>
                                                    <select
                                                        value={registerModel.userInfo.userInfoPrivacyType.userInfoPrivacyTypeId}
                                                        id="publicPage"
                                                        onChange={(e) => {
                                                            setRegisterModel({...registerModel, userInfo: {
                                                                    ...registerModel.userInfo,
                                                                    userInfoPrivacyType:
                                                                        {
                                                                            ...registerModel.userInfo.userInfoPrivacyType,
                                                                            userInfoPrivacyTypeId: Number(e.target.value)
                                                                        }
                                                                }})
                                                        }}
                                                    >
                                                        <option value={1} >Все</option>
                                                        <option value={2} >Никто</option>
                                                        <option value={3} >Только друзья</option>

                                                    </select>
                                                </div>
                                                <button onClick={()=>{register()}}>Зарегистрироваться</button>
                                                <button onClick={()=>{setPage(2)}}>назад</button>
                                            </div>
                                        //регистрация
                                        default:
                                            return <div>
                                                <button onClick={()=>{setPage(2)}}>регистрация</button>
                                                <button onClick={()=>{setPage(1)}}>авторизация</button>
                                            </div>
                                    }
                                })()}
                            </div>
                        </div>}
                </div>
            }
        </div>
    );
});

export default AuthPage;