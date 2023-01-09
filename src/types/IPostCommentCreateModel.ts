export interface IPostCommentCreateModel  {
    postId: number,
    userId: number,
    message: string,
    attachmentsId: number[]
}