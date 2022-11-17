import React, {FC, useContext, useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Header from "./components/Header";
import {observer} from "mobx-react-lite";
import MainPage from "./components/Pages/MainPage";
import AdminPage from "./components/Pages/AdminPage";
import Navbar from "./components/Navbar";
import {IFavorite} from "./types/IFavorite";
import UserService from "./services/UserService";
import {Context} from "./index";
import AuthService from "./services/AuthService";
import {AxiosError} from "axios";
import ErrorComponent from "./components/UI/ErrorComponent";
import LoadingComponent from "./components/UI/LoadingComponent";

/*
const App = observer(() => {
    return (
        <div>
            {/!*<AppRouter/>*!/}
            <Header/>
        </div>
      );
})
*/
const App =observer(() => {
    const {userStore} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    //userStore?.setIsLoading(true)

    AuthService.CheckAuth()
        .then(response=>{
            if(response.status == 200){
                userStore?.Login(response.data.user)
            }else{
                userStore?.Logout()
            }
            setIsLoading(false)
        })
        .catch((e:AxiosError)=>{
            userStore?.Logout()
            setIsLoading(false)
            //setIsError(true)
            //setError(e.message)
            //console.log(e.message)
        })


    return (
        <BrowserRouter>
            {isLoading
            ?

                <LoadingComponent/>
            :
                <div>
                    {isError
                    ?
                        <ErrorComponent/>
                    :
                    <div>
                        <Header/>
                        <AppRouter/>
                        <Navbar/>
                    </div>
                    }
                </div>
            }
        </BrowserRouter>
    );
})
export default App;
