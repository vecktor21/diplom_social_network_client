import React, {useContext, useEffect, useState} from 'react';
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

const DocumentsPage = () => {
    const [documents, setDocuments] = useState<IFile[]>([])
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
        fetchDocuments()
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
    const fetchDocuments = async ()=>{
        const isUserTemp = await checkPageType()
        try{
            let documentResult = {} as AxiosResponse<IFile[]>
            if(isUserTemp){
                documentResult = await FileService.GetUserFiles(userId, "document")
            }
            else{
                documentResult = await FileService.GetGroupFiles(groupId, "document")
            }
            setDocuments(documentResult.data)
            setIsLoading(false)
        }catch (e) {
            setIsLoading(false)
            setIsError(true)
        }
    }

    const openFileClickHandler = (document: IFile)=>{
        window.open(consts.API_URL+document.fileLink, "_blank")
    }
    const deleteFileClickHandler = async(document: IFile)=>{
        setIsLoading(true)
        try{
            const res = isUser
                ? await FileService.DeleteFile(document.fileId)
                : await FileService.DeleteFile(document.fileId, groupId)
            if(res.status==200){
                setIsLoading(false)
                alert("файл успешно удален")
                setDocuments((documents)=>[...documents.filter(d=>d.fileId!=document.fileId)])
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
                            Документы
                        </div>
                        <div className={global.mainSection}>
                            {
                                documents.length == 0
                                    ?
                                    <div> У вас еще нет ни одного документа. Загрузите изображения на вашей странице</div>
                                    :
                                    <div className={global.gridView} >
                                        {documents.map((doc)=>
                                            <div className={style.fileObject} key={doc.fileId}>
                                                <div
                                                    className={style.fileName}
                                                >
                                                    <span
                                                        onClick={()=>{openFileClickHandler(doc)}}
                                                        title={doc.logicalName}
                                                    >{doc.logicalName.length > 20 ? doc.logicalName.slice(0,20)+"...":doc.logicalName}</span>
                                                    {groupBelonging.isLeader &&
                                                    <Delete
                                                        className={global.delete}
                                                        onClick={()=>{deleteFileClickHandler(doc)}}

                                                    />}
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

export default DocumentsPage;