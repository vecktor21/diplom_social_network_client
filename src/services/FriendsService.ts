import {AxiosResponse} from "axios";
import {IFriend} from "../types/IFriend";
import api from "./AxiosService";
import {IFriendRequest} from "../types/IFriendRequest";
import {IFriendRequestResponse} from "../types/IFriendRequestResponse";

export class FriendsService {
    static async GetFriends(userId: number) {
        const result = await api.get<IFriend[]>("/api/friends?userId="+userId)
        return result
    }
    static async FindFriends(search: string) {
        const result = await api.get<IFriend[]>("/api/friends/FindUsers?search="+search)
        return result.data
    }
    static async CreateFriendRequest(request: IFriendRequest) {
        const result = await api.post("/api/Friends/FriendRequest", request)
        return result
    }
    static async GetFriendRequests(userId: number){
        const result = await api.get<IFriendRequestResponse[]>(`/api/Friends/GetFriendRequests/${userId}`)
        return result
    }
    static async AnswerToFriendRequest(res: boolean, requestId: number){
        await api.get(`/api/Friends/FriendRequest?requestId=${requestId}&isAccepted=${res}`)
    }
    static async HasFriendRequest(currentUserId: number, targetUserId: number){
        const result = await api.get<boolean>(`/api/Friends/HasFriendRequest?currentUserId=${currentUserId}&targetUserId=${targetUserId}`)
        return result
    }
    static async IsFriendWith(currentUserId: number, targetUserId: number){
        const result = await api.get<boolean>(`/api/Friends/IsFriend?currentUserId=${currentUserId}&targetUserId=${targetUserId}`)
        return result
    }
    static async CancelFriendRequest(currentUserId: number, targetUserId: number){
        const result = await api.delete<boolean>(`/api/Friends/RemoveFriendRequest?currentUserId=${currentUserId}&targetUserId=${targetUserId}`)
        return result
    }
    static async RemoveFromFriends(currentUserId: number, targetUserId: number){
        const result = await api.delete<boolean>(`/api/Friends/RemoveFromFriends?currentUserId=${currentUserId}&targetUserId=${targetUserId}`)
        return result
    }
}