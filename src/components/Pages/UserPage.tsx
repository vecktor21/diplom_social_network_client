import React, {useContext, useEffect, useState} from 'react';
import global from '../style/Global.module.css'
import page from '../style/Page.module.css'
import {observer} from "mobx-react-lite";
import {IUser} from "../../types/IUser";
import UserService from "../../services/UserService";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {Context} from "../../index";
import ProfileImage from "../UI/ProfileImage";
import {Size} from "../../types/Size";
import {IUserInfo} from "../../types/IUserInfo";
import {IFriend} from "../../types/IFriend";
import {IBannedUser} from "../../types/IBannedUser";
import Button from "../UI/Button";
import routes from '../../consts'
import {IFile} from "../../types/IFile";
import {IPost} from "../../types/IPost";
import PostComponent from "../PostComponent";
import {IGroup} from "../../types/IGroup";
import {FriendsService} from "../../services/FriendsService";
import consts from "../../consts";
import {AxiosError} from "axios";
import {IFriendRequest} from "../../types/IFriendRequest";
import Modal from "../UI/Modal";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {log} from "util";
import FileService from "../../services/FileService";
import FileUploadComponent from "../UI/FileUploadComponent";
import {IAttachment} from "../../types/IAttachment";
import {IComment} from "../../types/IComment";
import PostService from "../../services/PostService";
import {IPostCreateViewModel} from "../../types/IPostCreateViewModel";
import MessageComponent from "../MessageComponent";
import {MessengerService} from "../../services/MessengerService";
import {ICreateChatRoomModel} from "../../types/ICreateChatRoomModel";
import {BanService} from "../../services/BanService";

const UserPage = observer(() => {
    //пользователь, на странице которого находимся
    const [user, setUser] = useState({} as IUser)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchParams] = useSearchParams()
    //айди пользователя, на странице которого находимся
    let id = Number(searchParams.get("id"))
    const {userStore, userFavoritesStore} = useContext(Context)
    const [userInfo, setUserInfo] = useState({} as IUserInfo)
    const [friends, setFriends] = useState([] as IFriend[])
    const [groups, setGroups] = useState([] as IGroup[])
    const [chatRoomId, setChatRoomId] = useState(0)
    const [userFiles, setUserFiles] = useState([] as IFile[])
    const [userPosts, setUserPosts] = useState([] as IPost[])
    const [friendRequestMessage, setFriendRequestMessage] = useState("Добрый день, я бы хотел добавить вас в друзья :)")
    const [isFriendRequestModalVisible, setIsFriendRequestModalVisible] = useState(false)
    const navigate = useNavigate()
    //являюсь ли я другом с пользователем, на странице которого находимся
    const [isFriendWith, setIsFriendWith] = useState(false)
    //отправлял ли я запрос в друзья пользователю, на странице которого находимся
    const [isFriendRequestSent, setIsFriendRequestSent] = useState(false)

    //блокировка пользователя
    const [isBlockModalVisible, setIsBlockModalVisible] = useState(false)
    const [blockReason, setBlockReason] = useState<string|null>(null )

    //загрузка файлов
    //для открытия модального окна
    const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false)
    //файлы для загрузки на страницу
    const [filesToUpload, setFilesToUpload] = useState([] as File[])

    //проверка, могу ли я просматривать страницу
    const [isAllowed, setIsAllowed] = useState(true)

    //создание постов
    //модель поста
    const [newPost, setNewPost] = useState({attachments: [] as number[], text: "", title: ""} as IPostCreateViewModel)
    //открытие соответствующих модальных окон
    const [isPostFilesUploadModalVisible, setIsPostFilesUploadModalVisible] = useState(false)
    const [isPostCreateModelVisible, setIsPostCreateModelVisible] = useState(false)

    useEffect(()=>{
        fetchData()
    }, [id])

    const fetchData = async()=>{
        setIsLoading(true)
        //временная переменная пользователя. используется из-за того,
        // что setUser - асинхронна. хранит общую инфу пользователя на странице которого находится
        let temp_user = {} as IUser
        let isAllowedTemp:boolean
        //временная переменная, которая характеризует ID юзера. если авторизован, то равно его ID из UserStore. если нет; -1
        let my_id_temp:number
        if(userStore?.user.userId != undefined || userStore?.user.userId != null){
            my_id_temp = userStore?.user.userId
        }else{
            my_id_temp = -1
        }
        //загрузка общей инфы пользователя
        //если текущая страница - моя:
        if(id==userStore?.user.userId){
            //устанавливаем состояние текущего пользователя
            setUser(userStore?.user)
            //дублируем состояние текущего пользователя во временную переменную
            temp_user = userStore?.user
            //загрузка избранного
            //происходит только в том случае, если мы авторизованы
            if(userStore?.user.userId != undefined || userStore?.user.userId != null){
                const favsResponse = UserService.GetFavorites(userStore?.user.userId)
                userFavoritesStore?.setFavorites(favsResponse)
            }
        }
        //если текущая страница - НЕ моя:
        else {
            UserService.GetUser(id)
                .then(async (data)=>{
                    //устанавливаем состояние текущего пользователя
                    setUser(data)
                    //дублируем состояние текущего пользователя во временную переменную
                    temp_user = data
                    const res =await UserService.CheckIsAllowed(id, my_id_temp)
                    try{
                        if(res.status!=200){
                            window.alert("нет доступа")
                            console.log("нет доступа")
                            setIsAllowed(false)
                            isAllowedTemp=false
                        }else{
                            isAllowedTemp=true
                            setIsAllowed(true)
                        }
                    }catch (e){
                        window.alert("нет доступа")
                        console.log("нет доступа")
                        setIsAllowed(false)
                        isAllowedTemp=false
                        return
                    }
                })
                .catch((e : AxiosError)=>{
                    id = 0
                    setIsError(true)
                })
        }



        //загрузка проверок на то, нахожусь ли я в друзьях у пользователя:
        FriendsService.IsFriendWith(my_id_temp, id)
            .then(res=>{
                setIsFriendWith(res.data)
                setIsLoading(false)
            })
            .catch(e=>{
                setIsError(true)
                setIsLoading(false)
            })

        fetchHasFriendRequest(my_id_temp)


        //загрузка другой инфы пользователя
        //если мы не авторизованы, то отпарвляем currentUserId -1, то есть такая вот проверка на авторизацияю.
        // скорее всего удалится
        let infoResponse = await UserService.GetUserInfo(id, my_id_temp)
        setUserInfo(infoResponse)


        //подгрузка списка друзей
        FriendsService.GetFriends(id).then(response=>{
            setFriends(response.data)
        })



        //подгрузка подписок
        UserService.GetUserGroups(id)
            .then(res=> {
                setGroups(res.data)
            })
            .catch(e=>{
                setIsError(true)
                setIsLoading(false)
            })

        fetchUserFiles()


        fetchPosts()
    }


    //обработчик отправки сообщения
    const toChatRoom = async ()=>{
        if(chatRoomId>0){
            console.log("UserPage: toChatRoom: ат уже создан, переход прямо к нему по id: ", chatRoomId)
            navigate(consts.MESSAGES_ROUTE+"/"+chatRoomId)
        }else{
            const newChatRoomId =await MessengerService.CreateChatRoom({
                chatRoomTypeId: 1,
                adminId: 0,
                chatRoomName: "",
                chatRoomMembers: [userStore?.user.userId, id]
            } as ICreateChatRoomModel)
            console.log("UserPage: toChatRoom: чата еще нет, создается новый: ", newChatRoomId)
            navigate(consts.MESSAGES_ROUTE+"/"+newChatRoomId.data)

        }
    }

    //загрузка проверок на то, отправил ли я ему запрос в друзья:
    const fetchHasFriendRequest = async (myId:number)=>{
        const res = await FriendsService.HasFriendRequest(myId, id)
        try{
            setIsFriendRequestSent(res.data)
            setIsLoading(false)
        }
        catch(e) {
            setIsError(true)
            setIsLoading(false)
        }
    }

    //загрузка постов
    const fetchPosts = async()=>{
        try {
            setIsLoading(true)
            const postResult = await PostService.GetUserPosts(id)
            await setUserPosts(postResult.data)
        }catch (e) {
            setIsError(true)
        }
        setIsLoading(false)
    }

    //загрузка файлов пользователя
    const fetchUserFiles = async ()=>{
        try {
            setIsLoading(true)
            const fileResult = await FileService.GetUserFiles(id)
            setUserFiles(fileResult.data)
        }catch (e) {
            setIsError(true)
        }
        setIsLoading(false)
    }

    const blockUser = async()=>{
        if(userStore?.user && user.userId){
            try {
                setIsLoading(true)
                const res = await BanService.BanUser(user.userId, userStore.user.userId, blockReason, null)
                console.log(res.status)
            }catch (e) {
                setIsError(true)
            }
            setIsLoading(false)
            setIsBlockModalVisible(false)
        }
        else{
            window.alert("ошибка")
        }
    }

    //todo
    const showMore = ()=>{
        console.log(localStorage.getItem("token"))
        console.log(localStorage.getItem("userId"))
        console.log(userStore?.user.name)
        console.log(userStore?.isAuth)
        UserService.GetUsers().then(response=>{
            response.data.forEach(u=>{
                console.log(`user: ${u.userId}`)
                console.log(`name: ${u.name}`)
                console.log(`role: ${u.role}`)
                console.log("\n")
            })
        })
    }


    const removeFromFriends = ()=>{
        setIsLoading(true)
        if(userStore?.user.userId != undefined){
            FriendsService.RemoveFromFriends(userStore?.user.userId, id)
                .then(res=>{
                    setIsLoading(false)
                    alert("вы успешно удалили пользователя из друзей")
                    setIsFriendWith(false)
                })
                .catch(e=>{
                setIsLoading(false)
                setIsError(true)
            })
        }
    }


    const cancelFriendRequest = ()=>{
        setIsLoading(true)
        if(userStore?.user.userId != undefined){
            FriendsService.CancelFriendRequest(userStore?.user.userId, id)
                .then(res=>{
                    setIsLoading(false)
                    alert("вы успешно отменили запрос в друзья")
                    setIsFriendRequestSent(false)
                })
                .catch(e=>{
                    setIsLoading(false)
                    setIsError(true)
                })
        }
    }


    const addToFriends = ()=>{
        setIsLoading(true)
        FriendsService.CreateFriendRequest({message: friendRequestMessage, senderId: userStore?.user.userId, userId: user.userId} as IFriendRequest)
            .then(response=>{
                console.log(response.status)
                setIsFriendRequestModalVisible(false)
                setIsFriendRequestSent(true)
                setIsLoading(false)
            })
            .catch(e=>{
                console.log(e)
                setIsLoading(false)
            })
    }


    const uploadFiles = async ()=>{
        setIsLoading(true)
        const formData = new FormData()
        filesToUpload.forEach(file=>{
            formData.append("files", file)
        })
        try{
            await FileService.UploadFiles(formData)
            alert("файлы успешно добавлены")
            setIsPostCreateModelVisible(false)
        }
        catch(e){
            console.log(e)
            alert("ошибка загрузки файлов")
        }
        finally {
            setIsLoading(false)
        }
    }

    const createPost = async()=>{
        setIsLoading(true)
        const formData = new FormData()
        filesToUpload.forEach(file=>{
            formData.append("files", file)
        })
        try{
            const fileResult = await FileService.UploadFiles(formData)
            // @ts-ignore
            newPost.authorId = userStore?.user.userId
            fileResult.data.forEach(data=>{
                newPost.attachments.push(data.fileId)
            })
            console.log(newPost)
            await PostService.CreateUserPost(newPost)
            alert("пост успешно создан")
            setIsPostCreateModelVisible(false)
        }
        catch(e){
            console.log(e)
            alert("ошибка создания поста")
        }
        finally {

            setIsLoading(false)
        }
    }

    const deletePost = async (postId: number)=>{
        setIsLoading(true)
        try{
            const res = await PostService.DeleteUserPost(postId)
            console.log(res.data)
            alert("пост успешно удален")
        }catch (e) {
            alert("ошибка удаления поста")
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            {!userStore?.isAuth
            ?
                <div>авторизуйтесь</div>
            :
                <div>{isLoading
                    ?
                    <LoadingComponent/>
                    :
                    <div>
                        {isError
                            ? <ErrorComponent/>
                            :
                            <div className={global.pageContent}>
                                {/*модальное окно блокировки пользователя*/}
                                <Modal isVisible={isBlockModalVisible} setIsVisible={setIsBlockModalVisible}>
                                    <div>
                                        <label htmlFor="reason">Причина блокировки</label>
                                        <input
                                            type="text" id="reason"
                                            value={blockReason ? blockReason : ""}
                                            onChange={e=>{setBlockReason(e.target.value)}}
                                        />
                                    </div>
                                    <button onClick={blockUser}>Заблокировать</button>
                                </Modal>

                                {/*модальное окно загрузки файлов*/}
                                <Modal isVisible={isFriendRequestModalVisible} setIsVisible={setIsFriendRequestModalVisible}>
                                    <label htmlFor="friendRequestMessage">ваше сообщение</label>
                                    <input
                                        type="text" id="friendRequestMessage"
                                        value={friendRequestMessage}
                                        onChange={e=>{setFriendRequestMessage(e.target.value)}}
                                    />
                                    <button onClick={()=>{addToFriends()}}>отправить запрос</button>
                                </Modal>


                                {/*модальное окно создания поста*/}
                                <Modal isVisible={isPostCreateModelVisible} setIsVisible={setIsPostCreateModelVisible}>
                                    <label htmlFor="postTitle">заголовок поста</label>
                                    <input
                                        type="text" id="postTitle"
                                        value={newPost.title}
                                        onChange={e=>{setNewPost({...newPost, title:e.target.value})}}
                                    />
                                    <label htmlFor="postText">текст поста</label>
                                    <textarea
                                        id="postText"
                                        value={newPost.text}
                                        onChange={e=>{setNewPost({...newPost, text:e.target.value})}}
                                    ></textarea>
                                    <button onClick={()=>setIsPostFilesUploadModalVisible(true)}>добавить файлы во вложение</button>
                                    <button onClick={()=>{createPost()}}>создать пост</button>
                                </Modal>


                                {/*модальное окно для загрузки файлов */}
                                <FileUploadComponent
                                    isVisible={isFileUploadModalVisible}
                                    setIsVisible={setIsFileUploadModalVisible}
                                    files={filesToUpload}
                                    setFiles={setFilesToUpload}
                                    uploadHandler={uploadFiles}
                                />

                                {/*модальное окно для загрузки файлов в пост*/}
                                <FileUploadComponent
                                    isVisible={isPostFilesUploadModalVisible}
                                    setIsVisible={setIsPostFilesUploadModalVisible}
                                    files={filesToUpload}
                                    setFiles={setFilesToUpload}
                                    uploadHandler={()=>{setIsPostFilesUploadModalVisible(false)}}
                                />


                                <div className={page.topSection}>
                                    <div className={page.mainInfo}>
                                        <div className={page.infoSection}>
                                            <div className={page.infoLeft}>
                                                <ProfileImage src={`${consts.API_URL}/${user.profileImage}`} size={Size.large}/>
                                                <div>
                                                    <span>{user.name}</span>
                                                    <span>{user.surname}</span>
                                                </div>
                                                <div>
                                                    <span>{userInfo.status}</span>
                                                </div>
                                            </div>
                                            {user.userId == userStore?.user.userId
                                                ?
                                                <div className={page.infoRight}>
                                                    <Button onClick={()=>{navigate(routes.USER_OPTIONS_ROUTE)}}>редактировать</Button>
                                                    <Button onClick={()=>{showMore()}}>подробнее</Button>
                                                </div>
                                                :
                                                isAllowed ? <div className={page.infoRight}>
                                                    {
                                                        isFriendWith
                                                            ?
                                                            <Button onClick={()=>{removeFromFriends()}}>удалить из друзей</Button>
                                                            :
                                                            isFriendRequestSent
                                                                ?
                                                                <Button onClick={()=>{cancelFriendRequest()}}>отменить запрос в друзья</Button>
                                                                :
                                                                <Button onClick={()=>{setIsFriendRequestModalVisible(true)}}>добавить в друзья</Button>

                                                    }
                                                    <Button onClick={toChatRoom}>отправить сообщение</Button>
                                                    <Button onClick={()=>{showMore()}}>подробнее</Button>
                                                    <Button onClick={()=>{setIsBlockModalVisible(true)}}>заблокировать</Button>
                                                </div> : null
                                            }
                                        </div>
                                        {isAllowed
                                            ?
                                            <div className={page.additionalInfoSection}>
                                                <NavLink to={routes.IMAGES_PAGE_ROUTE + "?userId=" + id}>
                                                    {`${userFiles.filter(file => {
                                                        return file.fileType == "image"
                                                    }).length} Изображений`}
                                                </NavLink>
                                                <NavLink to={routes.VIDEOS_PAGE_ROUTE + "?userId=" + id}>
                                                    {`${userFiles.filter(file => {
                                                        return file.fileType == "video"
                                                    }).length} Видеозапией`}
                                                </NavLink>
                                                <NavLink to={routes.DOCUMENTS_PAGE_ROUTE + "?userId=" + id}>
                                                    {`${userFiles.filter(file => {
                                                        return file.fileType == "document"
                                                    }).length} Документа (-ов)`}
                                                </NavLink>
                                                <NavLink to={routes.FRIENDS_ROUTE + "?id=" + id}>
                                                    Друзья {` ${friends.length}`}
                                                </NavLink>
                                                <NavLink to={routes.GROUPS_ROUTE + "?id=" + id}>
                                                    Подписки {` ${groups.length}`}
                                                </NavLink>
                                                <NavLink to={routes.USER_ARTICLES_NAVIGATION_ROUTE + "/" + id}>
                                                    Статьи
                                                </NavLink>
                                            </div>
                                            :
                                            <div></div>
                                        }
                                    </div>
                                </div>
                                {user.userId == userStore?.user.userId &&
                                    <div className={global.section}>
                                        <button onClick={()=>setIsFileUploadModalVisible(true)}>загрузить файлы</button>
                                        <button onClick={()=>setIsPostCreateModelVisible(true)}>создать пост</button>
                                    </div>
                                }
                                {
                                    isAllowed
                                    ?
                                        <div>
                                            {userPosts.length == 0
                                            ?
                                            <div>еще нет постов</div>
                                            :

                                            userPosts.map(post=>
                                            <PostComponent
                                                post={post}
                                                key={post.postId}
                                                isShowDelete={
                                                    (()=> post.author.authorId == userStore?.user.userId || userStore?.user.role.toLocaleLowerCase() == "admin"
                                                    )()
                                                }
                                                deletePost={()=>{deletePost(post.postId)}}
                                            />
                                            )}
                                        </div>

                                    :
                                        <div>
                                            у вас нет доступа
                                        </div>
                                }
                            </div>
                        }
                    </div>
                }
                </div>
            }
        </div>
    );
});

export default UserPage;
