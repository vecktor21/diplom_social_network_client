import api from "./AxiosService";
import consts from "../consts"
import {IFile} from "../types/IFile";
export default class FileService {
    static async GetUserFiles(userId: number, filter?: string){
        return await api.get<IFile[]>(consts.API_URL + `/api/File/UserFiles/${userId}${filter ? "/"+filter : ""}`)
    }
    static async GetGroupFiles(groupId: number, filter?: string){
        return await api.get<IFile[]>(consts.API_URL + `/api/File/GroupFiles/${groupId}${filter ? "/"+filter : ""}`)
    }

    static async UploadFiles(formData: FormData, groupId?: number){
        const headers = { "Content-Type": "multipart/form-data" }
        if(groupId){
            // @ts-ignore
            headers["Group"] = groupId
        }
        await api.put<IFile[]>(consts.API_URL + `/api/file/AddFiles`, formData, {
            headers: headers
        })
    }
    static async DeleteFile(fileId: number, groupId? : number){
        return await api.delete<IFile[]>(consts.API_URL + `/api/File/${fileId}${groupId ? "/"+groupId : ""}`)
    }
}