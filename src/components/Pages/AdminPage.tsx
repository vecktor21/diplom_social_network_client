import React, {useEffect, useMemo, useState} from 'react';
import { forwardRef } from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import TableComponent from "../TableComponent";
import UserService from "../../services/UserService";
import {IUser} from "../../types/IUser";

const AdminPage = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSection, setSelectedSection] = useState(1)
    const [users, setUsers] = useState([] as IUser[])
    useEffect(()=>{
        fetchUsers()
    }, [])

    const fetchUsers = async ()=>{
        const response = await UserService.GetUsers()
        setUsers(response.data)
        setIsError(false)
        setIsLoading(false)
    }


    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <LoadingComponent/>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :
                        <div className={global.mainSection}>
                            <div className={global.pageArticle}>Страница администратора</div>
                            <TableComponent users={users}/>
                        </div>
                    }
                </div>
            }
        </div>
    );
};
export default AdminPage;
