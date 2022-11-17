import {IFriendRequest} from "./IFriendRequest";
import {IUser} from "./IUser";

export interface IFriendRequestResponse extends IFriendRequest{
    requestID: number,
    sender: IUser
}