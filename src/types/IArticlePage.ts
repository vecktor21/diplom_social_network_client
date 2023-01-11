import {ILike} from "./ILike";
import {IComment} from "./IComment";

export interface IArticlePage {
    articlePageId: number,
    authorId: number,
    text: string,
    articleTitle: string,
    articleId: number,
    likes: ILike[],
    comments: IComment[],
    articlePages: number[],
    publicationDate: Date,
}