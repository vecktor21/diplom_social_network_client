export interface ICommentCreateModel {
    postId: number,
    userId: number,
    message: string,
    attachmentsId: number[]
}