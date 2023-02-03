import React, {useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {IChatRoom} from "../../types/IChatRoom";
import {MessengerService} from "../../services/MessengerService";
import {Context} from "../../index";
import ChatRoomComponent from "../ChatRoomComponent";
import Modal from "../UI/Modal";
import {ICreateChatRoomModel} from "../../types/ICreateChatRoomModel";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import consts from "../../consts";
import {FriendsService} from "../../services/FriendsService";
import {IFriend} from "../../types/IFriend";
import {useNavigate} from "react-router-dom";
import {IKeyWord} from "../../types/IKeyWord";
import {IUser} from "../../types/IUser";
import FriendComponent from "../FriendComponent";
import style from "../style/InfoCard.module.css";
import routes from "../../consts";
import ProfileImage from "../UI/ProfileImage";
import {Size} from "../../types/Size";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";

const MessagesPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [chatRooms, setChatRooms] = useState([] as IChatRoom[])
    const {userStore} = useContext(Context)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [foundUsers, setFoundUsers] = useState([] as IFriend[])
    const navigate = useNavigate()
    const [usersToAdd, setUsersToAdd] = useState([] as IFriend[])
    //проверка валидности формы создания чата
    const [isValid, setIsValid] = useState(false)
    const [newChatRoom, setNewChatRoom] = useState({
        chatRoomName: "",
        //1 - приватная, 2 - публичная
        chatRoomTypeId: 2,
        chatRoomMembers: [],
        adminId: 0
    } as ICreateChatRoomModel)

    const searchUsers = ()=>{
        setIsSearchLoading(true)
        FriendsService.FindFriends(searchText)
            .then(data=>{
                setFoundUsers(data)
                //console.log(data)
                setIsSearchLoading(false)
            })
    }
    useEffect(()=>{
        fetchChatRooms()
    },[])
    const fetchChatRooms = async()=>{
        try{
            if(userStore?.user.userId){
                const response =await MessengerService.GetUserChatRooms(userStore?.user.userId)

                const chatRoomsWithLastMessage = response.data.filter(x=>x.lastMessage)
                const chatRoomsWithoutLastMessage = response.data.filter(x=>!x.lastMessage)
                // @ts-ignore
                chatRoomsWithLastMessage.sort((a,b)=> new Date(b.lastMessage.sendingTime) - new Date(a.lastMessage.sendingTime))

                console.log("chatRoomsWithLastMessage: ",chatRoomsWithLastMessage)

                setChatRooms([...chatRoomsWithLastMessage, ...chatRoomsWithoutLastMessage])
            }
        }catch (e) {
            console.log(e)
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }

    }

    useEffect(()=>{
        if(!newChatRoom.chatRoomName || newChatRoom.chatRoomName.length==0 || usersToAdd.length==0){
            setIsValid(false)
        }
        else{
            setIsValid(true)
            if(userStore?.user.userId){

                setNewChatRoom({...newChatRoom,
                    adminId: userStore?.user.userId,
                    chatRoomMembers:  [...usersToAdd.map(u=>u.userId), userStore.user.userId]
                })
            }
        }

    }, [newChatRoom.chatRoomName, usersToAdd])



    const createPublicChatRoom = async ()=>{
        if(!newChatRoom.chatRoomName || newChatRoom.chatRoomName.length==0){
            window.alert("необходимо заполнить имя группы")
        }
        else if(usersToAdd.length==0){
            window.alert("необходимо добавить как минимум двух пользователей")
        }
        else if(!isValid){
            window.alert("ошибка")
        }else{

            MessengerService.CreateChatRoom(newChatRoom)
                .then(data=>{
                    window.alert("чат успешно создан")
                })
                .catch(e=>{
                    window.alert("ошибка при создании чата")
                })
        }
    }

    const addUserHandler = (user: IFriend)=>{
        if(usersToAdd.filter(u=>u.userId==user.userId).length==0){
            setUsersToAdd((u)=>[...u, user])
        }
        setSearchText("")
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
                            <Modal isVisible={isModalVisible} setIsVisible={setIsModalVisible}>
                                <div>
                                    <label htmlFor="name">Введите название чата</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={newChatRoom.chatRoomName}
                                        onChange={e=>{setNewChatRoom({...newChatRoom,chatRoomName:e.target.value})}}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={global.searchBlockInSection + " " + global.searchBlock}
                                        style={{width:"100%"}}
                                    >
                                        <input
                                            value={searchText}
                                            placeholder={"поиск людей"}
                                            onChange={(e)=>{setSearchText(e.target.value)}}
                                            onKeyDown={(e)=>{
                                                if(e.key.toLowerCase()=="enter"){
                                                    searchUsers()
                                                }
                                            }}
                                        />
                                    </div>
                                    {searchText==""
                                        ?
                                        <div>начните вводить текст чтобы найти людей</div>
                                        :
                                        <div >
                                            {
                                                isSearchLoading
                                                    ?
                                                    <LoadingComponent/>
                                                    :
                                                    <div style={{position:"relative"}}>
                                                        {foundUsers.length>0
                                                            ?
                                                            <div className={global.searchResult} style={{
                                                                top:"-20px",
                                                                left:"10px",
                                                                right:"10px"
                                                            }}>
                                                                {foundUsers.map(user=>
                                                                    <div key={user.userId} className={global.searchResultItem}>
                                                                        {user.name} {user.surname} {user.nickname}
                                                                        <button onClick={()=>{addUserHandler(user)}}>добавить</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            :<div></div>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    }
                                    <div>
                                        {usersToAdd.map(user=>{
                                            const name = user.name + " " + user.surname
                                            return <div
                                                key={user.userId}
                                                className={style.card}
                                                onClick={()=>{navigate(routes.USER_PAGE_ROUTE + "?id="+user.userId)}}
                                                style={{width:"100%"}}
                                            >
                                                <ProfileImage src={consts.API_URL + '/' + user.profileImage} size={Size.medium}/>
                                                <div className={style.name}>
                                                    <span>
                                                        {name.length > 20 ?
                                                            name.slice(0, 17) + "..."
                                                            :
                                                            name}
                                                    </span>
                                                    <span>
                                                        {/*{props.Friend.nickname.length > 20 ?
                                                            props.Friend.nickname.slice(0, 17) + "..."
                                                            :
                                                            props.Friend.nickname}*/}
                                                        {user.nickname}
                                                    </span>
                                                </div>

                                                <Cross className={global.cross} onClick={(e)=>{
                                                    e.stopPropagation()
                                                    setUsersToAdd((prev)=>usersToAdd.filter(u=>u.userId!=user.userId))
                                                }}/>
                                            </div>
                                        })}
                                    </div>
                                    <button onClick={createPublicChatRoom} disabled={!isValid}>создать</button>
                                </div>
                            </Modal>
                            <div className={global.pageArticle}>Сообщения</div>
                            <button onClick={()=>{setIsModalVisible(true)}}>
                                Создать групповой чат
                            </button>
                            {
                                chatRooms.map((chat,ind)=>
                                    <ChatRoomComponent chatRoom={chat} key={ind}/>
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