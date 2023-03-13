import React, {useContext} from 'react';
import global from './style/Global.module.css'
import header from './style/Header.module.css'
import {ReactComponent as Logo} from './assets/find-icon.svg'
import {ReactComponent as Setting} from './assets/settings-icon.svg'
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import routes from '../consts'
//временное
import img from ".././Placeholders/imgPlaceholder.png"
import {NavLink, useNavigate} from "react-router-dom";
import AuthService from "../services/AuthService";
import Notifications from "./Notifications";
import MainSearchComponent from "./MainSearchComponent";


const Header = observer(() => {
    const {userStore} = useContext(Context)
    const navigate = useNavigate()
    const logout = (e:React.MouseEvent<HTMLAnchorElement>)=>{
        console.log("начат выход")
        e.preventDefault()
        AuthService.Logout()
        userStore?.Logout();
        navigate("/")
        console.log("вроде сработало")
    }
    return (
        <div className={header.header}>
            <div className={global.contentContainer + " " + header.content}>
                <MainSearchComponent/>
                {userStore?.isAuth
                ?
                <div className={header.profileBlock}>
                    <img src={routes.API_URL + userStore.user.profileImage} className={header.profileImage}/>
                    <span>{userStore?.user.name}</span>
                    <span>{userStore?.user.surname}</span>
                    <span>{
                        userStore?.user.nickname != undefined && userStore?.user.nickname.length > 20 ?
                            userStore?.user.nickname.slice(0, 17) + "..."
                            :
                            userStore?.user.nickname
                    }</span>
                    <Notifications/>
                    <ul className={global.dropdownList}>
                        <li><Setting id="settings" className={global.settings}/></li>
                        <li>
                            <ul className={global.dropdownSubList}>
                                <li><NavLink to={routes.USER_OPTIONS_ROUTE}>параметры</NavLink></li>
                                {
                                    userStore?.user.role==="ADMIN" &&
                                    <li><NavLink to={routes.ADMIN_ROUTE}>Админ </NavLink></li>
                                }
                                <li><NavLink to={""} onClick={logout}>Выйти</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
                :
                <div>
                    <NavLink to={routes.AUTH_ROUTE}>авторизация </NavLink>
                </div>
                }
            </div>
        </div>
    );
});

export default Header;
