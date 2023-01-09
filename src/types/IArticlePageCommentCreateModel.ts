export interface IArticlePageCommentCreateModel {
    articlePageId: number,
    userId: number,
    message: string,
    attachmentsId: number[]
}