export interface IMessageCreateModel {
    chatRoomId : number,
    text : string,
    senderId : number,
    messageAttachmentIds : number[]
}