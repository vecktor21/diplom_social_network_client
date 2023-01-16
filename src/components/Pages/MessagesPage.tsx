import React, {useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {IChatRoom} from "../../types/IChatRoom";
import {MessengerService} from "../../services/MessengerService";
import {Context} from "../../index";
import ChatRoomComponent from "../ChatRoomComponent";

const MessagesPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [chatRooms, setChatRooms] = useState([] as IChatRoom[])
    const {userStore} = useContext(Context)
    useEffect(()=>{
        fetchChatRooms()
    },[])
    const fetchChatRooms = ()=>{
        try{
            if(userStore?.user.userId){
                const response = MessengerService.GetUserChatRooms(userStore?.user.userId)
                // @ts-ignore
                setChatRooms(response)
            }
        }catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }

    }

    return (

        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    <LoadingComponent/>
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :

                        <div className={global.mainSection}>
                            <div className={global.pageArticle}>Сообщения</div>
                            {
                                chatRooms.map(chat=>
                                    <ChatRoomComponent chatRoom={chat}/>
                                )
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default MessagesPage;