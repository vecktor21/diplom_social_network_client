export interface ICreateChatRoomModel{
    chatRoomName: string,
    //1 - приватная, 2 - публичная
    chatRoomTypeId: number,
    chatRoomMembers: number[],
    adminId: number
}