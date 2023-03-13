import {IGroup} from "../types/IGroup";
import {IPost} from "../types/IPost";
import PostService from "./PostService";
import api from "./AxiosService";
import consts from "../consts";
import {ICreateGroupModel} from "../types/ICreateGroupModel";
import {GroupBelonging} from "../types/GroupBelonging";
import {IRequestToGroup} from "../types/IRequestToGroup";
import {GlobalService} from "./GlobalService";
import {UserShortViewModel} from "../types/UserShortViewModel";
export default class GroupService {
    //изменение информации
    static async ChangeInfo(groupId:number, groupName:string,isPublic:boolean){
        return await api.post(`${consts.API_URL}/api/group/ChangeInfo`, {
            groupId,groupName,isPublic
        });
    }
    //изменение картинки
    static async ChangeProfileImage(groupId: number, newImageId: number){
        const res = await api.post(`/api/Group/ChangeGroupProfileImage?groupId=${groupId}&newImageId=${newImageId}`)
        console.log(res.data)
        console.log(res.status)
        console.log(res.headers)

    }
    static async GetGroup(groupId: number) {
        const response = await api.get<IGroup>(`${consts.API_URL}/api/group/${groupId}`)
        return response
    }
    static async GetGroupMembers(groupId: number) {
        const response = await api.get<UserShortViewModel[]>(`/api/group/GetGroupMembersByGroupId/${groupId}`)
        return response
    }
    static async FindGroups(search: string){
        return await api.get<IGroup[]>(`${consts.API_URL}/api/group/FindGroups?search=${search}`);
    }
    static async CreateGroup(group: ICreateGroupModel){
        return await api.post(`${consts.API_URL}/api/group/creategroup`, group);
    }
    static async CheckBelonging(userId: number,groupId: number){
        return await api.get<GroupBelonging>(`${consts.API_URL}/api/Group/CheckBelonging?userId=${userId}&groupId=${groupId}`);
    }
    static async Subscribe(userId: number,groupId: number){
        return await api.get(`${consts.API_URL}/api/Group/SubscribeToGroup?userId=${userId}&groupId=${groupId}`);
    }
    static async Unsubscribe(userId: number,groupId: number){
        return await api.get(`${consts.API_URL}/api/Group/Unsubscribe?userId=${userId}&groupId=${groupId}`);
    }
    static async ReactToRequest(userId: number,groupId: number, isAccepted: boolean){
        return await api.get(`${consts.API_URL}/api/Group/ReactToRequest?userId=${userId}&groupId=${groupId}&isAccepted=${isAccepted}`);
    }
    static async GetRequestsToGroupByUserId(userId: number,){
        return await api.get<IRequestToGroup[]>(`${consts.API_URL}/api/group/GetRequestsToGroupByGroupLeader?userId=${userId}`);
    }

}
