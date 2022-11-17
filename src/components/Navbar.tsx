import React, {FC, useContext, useEffect, useState} from 'react';
import routes from '../consts.js'
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import navbar from './style/Navbar.module.css'
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Navbar : FC = observer(() => {
    const location = useLocation()
    const navigate = useNavigate()
    const {userStore} = useContext(Context)
    const [selectedPage, setSelectedPage] = useState(0);
    const navigateTo=(path: string, setSelected: number)=>{
        navigate(path)
        setSelectedPage(setSelected)
    }
    return (
        <ul className={navbar.navbar}>
            <li><span
                className={selectedPage == 0 ? navbar.active : ""}
                onClick={()=>{navigateTo(routes.MAIN_ROUTE, 0)}}>Главная</span></li>
            {userStore?.isAuth &&
                <li><span
                    className={selectedPage == 1 ? navbar.active : ""}
                    onClick={()=>{navigateTo(routes.USER_PAGE_ROUTE + "?id=" + userStore?.user.userId, 1)}}
                >Моя страница</span></li>
            }
            <li><span
                className={selectedPage == 2 ? navbar.active : ""}
                onClick={()=>{navigateTo(routes.MESSAGES_ROUTE, 2)}}>Сообщения</span></li>
            <li><span
                className={selectedPage == 3 ? navbar.active : ""}
                onClick={()=>{navigateTo(routes.FRIENDS_ROUTE + "?id="+userStore?.user.userId, 3)}}>Друзья</span></li>
            <li><span
                className={selectedPage == 4 ? navbar.active : ""}
                onClick={()=>{navigateTo(routes.GROUPS_ROUTE + "?id="+userStore?.user.userId, 4)}}>Группы</span></li>
            <li><span
                className={selectedPage == 5 ? navbar.active : ""}
                onClick={()=>{navigateTo(routes.ARTICLES_ROUTE, 5)}}>Статьи</span></li>
        </ul>
    );
});

export default Navbar;