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
    const [filesToUpload, setFilesToUpload] = useState([] as File[])
    const [isFileUploadModalVisible, setIsFileUploadModalVisible] = useState(false)

    useEffect(()=>{
        fetchGroup()
        console.log(isError)
    }, [])

    const fetchGroup = async ()=>{
        if(id!=null){
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

            await fetchFiles()

            setIsLoading(false)

            const postResponse = GroupService.GetPosts(id)
            setGroupPosts(postResponse)
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
                        <FileUploadComponent
                            isVisible={isFileUploadModalVisible}
                            setIsVisible={setIsFileUploadModalVisible}
                            files={filesToUpload}
                            setFiles={setFilesToUpload}
                            uploadHandler={uploadFiles}
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
                            </div>
                        }
                        {
                            groupPosts.map(post=>
                                <PostComponent post={post} key={post.postId}/>
                            )
                        }
                    </div>


            }
        </div>
    );
});

export default GroupPage;