import React, {useContext, useEffect, useState} from 'react';
import global from '../style/Global.module.css'
import {observer} from "mobx-react-lite";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import UserService from "../../services/UserService";
import {IGroup} from "../../types/IGroup";
import GroupService from "../../services/GroupService";
import page from "../style/Page.module.css";
import ProfileImage from "../UI/ProfileImage";
import {Size} from "../../types/Size";
import Button from "../UI/Button";
import routes from "../../consts";
import PostComponent from "../PostComponent";
import {Context} from "../../index";
import {IPost} from "../../types/IPost";
import PostService from "../../services/PostService";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {GroupBelonging} from "../../types/GroupBelonging";
import FileService from "../../services/FileService";
import {IFile} from "../../types/IFile";
import FileUploadComponent from "../UI/FileUploadComponent";
import Modal from "../UI/Modal";
import {IPostCreateViewModel} from "../../types/IPostCreateViewModel";
const GroupPage = observer(() => {
    const [params] = useSearchParams()
    const id = Number(params.get("id"))
    const [group, setGroup] = useState({} as IGroup)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const {userStore} = useContext(Context)
    const [groupFiles, setGroupFiles] = useState([] as IFile[])
    const [groupBelonging, setGroupBelonging] = useState({
        isMember: false
    } as GroupBelonging)
    const [groupPosts, setGroupPosts] = useState([] as IPost[])

    //загрузка файлов
    const [filesToUpload, setFilesToUpload] = useState([] as File[])
    const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false)


    //создание постов
    //модель поста
    const [newPost, setNewPost] = useState({attachments: [] as number[], text: "", title: ""} as IPostCreateViewModel)
    //открытие соответствующих модальных окон
    const [isPostFilesUploadModalVisible, setIsPostFilesUploadModalVisible] = useState(false)
    const [isPostCreateModelVisible, setIsPostCreateModelVisible] = useState(false)

    useEffect(()=>{
        fetchGroup()
        console.log(isError)
    }, [])

    const fetchGroup = async ()=>{
        if(id!=null){

            //подгрузка инфы
            setIsLoading(true)
            const groupResponse = await GroupService.GetGroup(id)
            try{
                await setGroup(groupResponse.data)
            }catch (e) {
                setIsError(true)
                setIsLoading(false)
            }
            if(userStore?.user.userId != undefined){
                const GroupBelongingResponse = await GroupService.CheckBelonging(userStore?.user.userId, id)
                setGroupBelonging(GroupBelongingResponse.data)
            }

            //подгрузка файлов
            await fetchFiles()

            //подгрузка постов
            await fetchPosts()


            setIsLoading(false)
        }else {
            setIsError(true)
        }
        setIsLoading(false)
    }

    const fetchFiles =async ()=>{
        try {
            const fileResult = await FileService.GetGroupFiles(id)
            setGroupFiles(fileResult.data)
        }catch (e) {
            setIsLoading(false)
            setIsError(true)
        }

    }

    //загрузка постов
    const fetchPosts = async()=>{
        try {
            setIsLoading(true)
            const postResult = await PostService.GetGroupPosts(id)
            await setGroupPosts(postResult.data)
        }catch (e) {
            setIsError(true)
            setIsLoading(false)
        }
    }

    //обработчик отписки
    const unsubscribe = ()=>{
        setIsLoading(true)
        // @ts-ignore
        GroupService.Unsubscribe(userStore?.user.userId, id)
            .then(res=>{
                alert("вы отписались")
                console.log(res.data)
                setIsLoading(false)
            })
            .catch(e=>{
                alert("произошла ошибка")
                setIsLoading(false)
            })
    }

    //обработчик подписки
    const subscribe = ()=>{
        setIsLoading(true)
        // @ts-ignore
        GroupService.Subscribe(userStore?.user.userId, id)
            .then(res=>{
                alert("вы успешно подписались")
                console.log(res.data)
                setIsLoading(false)
            })
            .catch(e=>{
                alert("произошла ошибка")
                setIsLoading(false)
            })
    }

    const sendRequest = ()=>{
        setIsLoading(true)
        // @ts-ignore
        GroupService.Subscribe(userStore?.user.userId, id)
            .then(res=>{
                alert("вы отправили запрос")
                console.log(res.data)
                setIsLoading(false)
            })
            .catch(e=>{
                alert("произошла ошибка")
                setIsLoading(false)
            })
    }
    //TODO
    const edit = ()=>{
        alert("вы редактировали")
    }

    const cancelRequest = ()=>{
        setIsLoading(true)
        // @ts-ignore
        GroupService.ReactToRequest(userStore?.user.userId, id, false)
            .then(res=>{
                alert("вы отменили запрос ")
                console.log(res.data)
                setIsLoading(false)
            })
            .catch(e=>{
                alert("произошла ошибка")
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
            await FileService.UploadFiles(formData, id)
        }
        catch(e){
            console.log(e)
        }
        setIsLoading(false)
    }

    //создание поста
    const createPost = async()=>{
        setIsLoading(true)
        const formData = new FormData()
        filesToUpload.forEach(file=>{
            formData.append("files", file)
        })
        try{
            const fileResult = await FileService.UploadFiles(formData, id)
            // @ts-ignore
            newPost.authorId = id
            fileResult.data.forEach(data=>{
                newPost.attachments.push(data.fileId)
            })
            console.log(newPost)
            await PostService.CreateGroupPost(newPost)
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

    //удаление поста
    const deletePost = async (postId: number)=>{
        setIsLoading(true)
        try{
            const res = await PostService.DeleteGroupPost(postId)
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
        <div className={global.pageContent}>
            {isLoading
                ?

                <LoadingComponent/>
                :
                isError
                    ?
                    <ErrorComponent/>
                    :
                    <div >

                        {/*модальное окно создания поста*/}
                        <Modal isVisible={isPostCreateModelVisible} setIsVisible={setIsPostCreateModelVisible}>
                            <label htmlFor="postTitle">заголовок поста</label>
                            <input
                                type="text" id="postTitle"
                                value={newPost.title}
                                onChange={e=>{setNewPost({...newPost, title:e.target.value})}}
                            />
                            <label htmlFor="postTitle">текст поста</label>
                            <textarea
                                id="postTitle"
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
                                        <ProfileImage src={routes.API_URL + group.groupImage} size={Size.large}/>
                                        <div>
                                            <span>{group.groupName}</span>
                                        </div>
                                    </div>
                                    {
                                        userStore?.isAuth &&
                                            groupBelonging.isMember
                                                ?
                                                groupBelonging.isLeader
                                                    ?
                                                    <div>
                                                        <div className={page.infoRight}>
                                                            <Button onClick={()=>{edit()}}>редактировать (как модератор)</Button>
                                                        </div>
                                                        {groupBelonging.isAdmin &&
                                                        <div className={page.infoRight}>
                                                            <Button onClick={()=>{edit()}}>редактировать (как админ)</Button>
                                                        </div>
                                                        }

                                                    </div>
                                                    :
                                                    <div className={page.infoRight}>
                                                        <Button onClick={()=>{unsubscribe()}}>отписаться</Button>
                                                    </div>
                                                :
                                                group.isPublic
                                                    ?
                                                    <div className={page.infoRight}>
                                                        <Button onClick={()=>{subscribe()}}>подписаться</Button>
                                                    </div>
                                                    :
                                                    groupBelonging.isRequestSent
                                                        ?
                                                        <div className={page.infoRight}>
                                                            <Button onClick={()=>{cancelRequest()}}>отменить запрос</Button>
                                                        </div>
                                                        :
                                                        <div className={page.infoRight}>
                                                            <Button onClick={()=>{sendRequest()}}>отправить запрос</Button>
                                                        </div>


                                    }
                                </div>
                                <div className={page.additionalInfoSection}>
                                    <NavLink to={routes.IMAGES_PAGE_ROUTE + "?groupId="+id}>
                                        {`${groupFiles.filter(file=>{
                                            return file.fileType=="image"
                                        }).length} Изображений`}
                                    </NavLink>
                                    <NavLink to={routes.VIDEOS_PAGE_ROUTE + "?groupId="+id}>
                                        {`${groupFiles.filter(file=>{
                                            return file.fileType=="video"
                                        }).length} Видеозапией`}
                                    </NavLink>
                                    <NavLink to={routes.DOCUMENTS_PAGE_ROUTE + "?groupId="+id}>
                                        {`${groupFiles.filter(file=>{
                                            return file.fileType=="document"
                                        }).length} Документа (-ов)`}
                                    </NavLink>
                                    {/*<NavLink to={routes.FRIENDS_ROUTE + "?id="+id}>
                                        Друзья {` ${friends.length}`}
                                    </NavLink>
                                    <NavLink to={routes.GROUPS_ROUTE + "?id="+id}>
                                        Подписки {` ${groups.length}`}
                                    </NavLink>*/}
                                </div>
                            </div>
                        </div>
                        {
                            groupBelonging.isLeader &&
                            <div className={global.section}>
                                <button onClick={()=>setIsFileUploadModalVisible(true)}>загрузить файлы</button>
                                <button onClick={()=>setIsPostCreateModelVisible(true)}>создать пост</button>
                            </div>
                        }
                        {
                            groupPosts.length == 0
                                ?
                                <div>здесь еще нет записей</div>
                                :
                                groupPosts.map(post=>
                                    <PostComponent
                                        post={post}
                                        key={post.postId}
                                        isShowDelete={ groupBelonging.isLeader || userStore?.user.role.toLocaleLowerCase() == "admin"}
                                        deletePost={()=>{deletePost(post.postId)}}
                                    />
                                )
                        }
                    </div>


            }
        </div>
    );
});

export default GroupPage;