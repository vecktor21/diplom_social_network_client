import React, {useCallback, useContext, useEffect, useState} from 'react';
import ImageViewer from 'react-simple-image-viewer';
import {observer} from "mobx-react-lite";
import {IFile} from "../../types/IFile";
import global from '../style/Global.module.css'
import style from '../style/Files.module.css'
import consts from '../../consts'
import FileService from "../../services/FileService";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import {ReactComponent as Delete} from "../assets/delete-icon.svg";
import {AxiosResponse} from "axios";
import {GroupBelonging} from "../../types/GroupBelonging";
import {Context} from "../../index";
import GroupService from "../../services/GroupService";

const ImagesPage = observer(() => {
    const [images, setImages] = useState<IFile[]>([])
    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [params] = useSearchParams()
    const userId = Number(params.get("userId"))
    const groupId = Number(params.get("groupId"))
    const [isUser, setIsUser] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [groupBelonging, setGroupBelonging] = useState({
        isMember: false,
        isLeader: false,
    } as GroupBelonging)
    const {userStore} = useContext(Context)

    useEffect(()=>{
        fetchImages()
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

    const fetchImages = async ()=>{
        const isUserTemp = await checkPageType()
        try{
            let imageResult = {} as AxiosResponse<IFile[]>
            if(isUserTemp){
                imageResult = await FileService.GetUserFiles(userId, "image")
            }
            else{
                imageResult = await FileService.GetGroupFiles(groupId, "image")
            }
            await setImages(imageResult.data)
            setIsLoading(false)
            //console.log(images[0].logicalName)
        }catch (e) {
            setIsLoading(false)
            setIsError(true)
        }
    }

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };

    const openFileClickHandler = (img: IFile)=>{
        window.open(consts.API_URL+img.fileLink, "_blank")
    }

    const deleteFileClickHandler = async(img: IFile)=>{
        setIsLoading(true)
        try{
            const res = isUser
                ? await FileService.DeleteFile(img.fileId)
                : await FileService.DeleteFile(img.fileId, groupId)
            if(res.status==200){
                setIsLoading(false)
                alert("файл успешно удален")
                setImages((images)=>[...images.filter(i=>i.fileId!=img.fileId)])
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
                            Изображения
                        </div>
                        <div className={global.mainSection}>
                            {
                                images.length == 0
                                    ?
                                    <div> У вас еще нет ни одного изображения. Загрузите изображения на вашей странице</div>
                                    :
                                    <div className={global.gridView} >
                                        {images.map((img, ind)=>
                                            <div className={style.fileObject} key={img.fileId}>
                                                <img
                                                    src={consts.API_URL + img.fileLink}
                                                    alt={img.logicalName}
                                                    onClick={ () => openImageViewer(ind) }
                                                />
                                                <div
                                                    className={style.fileName}
                                                >
                                                    <span
                                                        onClick={()=>{openFileClickHandler(img)}}
                                                        title={img.logicalName}
                                                    >{img.logicalName.length > 20 ? img.logicalName.slice(0,20)+"...":img.logicalName}</span>
                                                    {groupBelonging.isLeader &&
                                                    <Delete
                                                        className={global.delete}
                                                        onClick={()=>{deleteFileClickHandler(img)}}
                                                    />
                                                    }

                                                </div>
                                            </div>
                                        )}
                                        {isViewerOpen && (
                                            <ImageViewer
                                                src={ images.map(img=>consts.API_URL + img.fileLink) }
                                                currentIndex={ currentImage }
                                                disableScroll={ false }
                                                closeOnClickOutside={ true }
                                                onClose={ closeImageViewer }
                                            />
                                        )}
                                    </div>

                            }
                        </div>
                    </div>
            }
        </div>
    );
});

export default ImagesPage;