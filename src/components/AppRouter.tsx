import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Route, Routes} from "react-router-dom";
import {PublicRoutes, AdminRoutes, NotAuthRoutes} from '../routes'
import routes from "../consts"
import {IUser} from "../types/IUser";
import UserStore from "../store/UserStore";
const AppRouter = observer(()=> {
    const {userStore} = useContext(Context)

    return (
        <Routes>
                {
                    userStore?.isAuth &&
                    PublicRoutes.map(route=>
                        <Route key={route.path} element={route.component} path={route.path}/>
                    )
                }
                {
                    userStore?.user.role === "ADMIN" &&
                    AdminRoutes.map(route=>
                        <Route key={route.path} element={route.component} path={route.path}/>
                    )
                }
                {
                    !userStore?.isAuth &&
                    NotAuthRoutes.map(route=>
                        <Route key={route.path} element={route.component} path={route.path}/>
                    )
                }

        </Routes>
    );
});

export default AppRouter;