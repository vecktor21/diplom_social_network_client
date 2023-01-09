export interface IArticleCommentCreateModel {
    articleId: number,
    userId: number,
    message: string,
    attachmentsId: number[]
}