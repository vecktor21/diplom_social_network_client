import React, {useCallback, useContext, useEffect, useState} from 'react';
import {IFile} from "../../types/IFile";
import {useSearchParams} from "react-router-dom";
import FileService from "../../services/FileService";
import consts from "../../consts";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import style from "../style/Files.module.css";
import {ReactComponent as Delete} from "../assets/delete-icon.svg";
import {AxiosResponse} from "axios";
import {GroupBelonging} from "../../types/GroupBelonging";
import {Context} from "../../index";
import GroupService from "../../services/GroupService";

const VideosPage = () => {
    const [videos, setVideos] = useState<IFile[]>([])
    const [params] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const userId = Number(params.get("userId"))
    const groupId = Number(params.get("groupId"))
    const [isUser, setIsUser] = useState(true)
    const [groupBelonging, setGroupBelonging] = useState({
        isMember: false,
        isLeader: false,
    } as GroupBelonging)
    const {userStore} = useContext(Context)

    useEffect(()=>{
        fetchVideos()
        checkBelonging()
    }, [])

    const checkBelonging = async()=>{
        if(userStore?.user.userId != undefined){
            const GroupBelongingResponse = await GroupService.CheckBelonging(userStore?.user.userId, groupId)
            setGroupBelonging(GroupBelongingResponse.data)
        }
    }

    const checkPageType = ():boolean=>{
        let isUserTemp
        if((userId == 0) && (groupId!=0)){
            setIsUser(false)
            isUserTemp = false
        }
        else if((userId!=0) && (groupId == 0)){
            setIsUser(true)
            isUserTemp = true
        }else{
            setIsError(true)
            setIsLoading(false)
            isUserTemp = false
        }
        return isUserTemp
    }
    const fetchVideos = async ()=>{
        const isUserTemp = await checkPageType()
        try{
            let videoResult = {} as AxiosResponse<IFile[]>
            if(isUserTemp){
                videoResult = await FileService.GetUserFiles(userId, "video")
            }
            else{
                videoResult = await FileService.GetGroupFiles(groupId, "video")
            }
            setVideos(videoResult.data)
            setIsLoading(false)
        }catch (e) {
            setIsLoading(false)
            setIsError(true)
        }
    }

    const openFileClickHandler = (video: IFile)=>{
        window.open(consts.API_URL+video.fileLink, "_blank")
    }
    const deleteFileClickHandler = async(video: IFile)=>{
        setIsLoading(true)
        try{
            const res = isUser
                ? await FileService.DeleteFile(video.fileId)
                : await FileService.DeleteFile(video.fileId, groupId)
            if(res.status==200){
                setIsLoading(false)
                alert("файл успешно удален")
                setVideos((videos)=>[...videos.filter(v=>v.fileId!=video.fileId)])
            }
        }catch (e) {
            setIsLoading(false)
            setIsError(true)
            alert("ошибка удаления файла")
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
                    <div>
                        <div className={global.pageArticle}>
                            Видеозаписи
                        </div>
                        <div className={global.mainSection}>
                            {
                                videos.length == 0
                                    ?
                                    <div> У вас еще нет ни одного видео. Загрузите изображения на вашей странице</div>
                                    :
                                    <div className={global.gridView} >
                                        {videos.map((vid)=>
                                            <div className={style.fileObject} key={vid.fileId}>
                                                <div
                                                    className={style.fileName}
                                                >
                                                    <span
                                                        onClick={()=>{openFileClickHandler(vid)}}
                                                        title={vid.logicalName}
                                                    >{vid.logicalName.length > 20 ? vid.logicalName.slice(0,20)+"...":vid.logicalName}</span>
                                                    {groupBelonging.isLeader &&
                                                    <Delete
                                                        className={global.delete}
                                                        onClick={() => {
                                                            deleteFileClickHandler(vid)
                                                        }}

                                                    />
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>

                            }
                        </div>
                    </div>
            }
        </div>
    );
};

export default VideosPage;