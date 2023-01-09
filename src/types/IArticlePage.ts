import {ILike} from "./ILike";
import {IComment} from "./IComment";

export interface IArticlePage {
    articlePageId: number,
    text: string,
    articleTitle: string,
    articleId: number,
    likes: ILike[],
    comments: IComment[]
}