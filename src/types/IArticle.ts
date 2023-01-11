import {IKeyWord} from "./IKeyWord";
import {IAuthorInfo} from "./IAuthorInfo";
import {ILike} from "./ILike";
import { IUser } from "./IUser";
import { IComment } from "./IComment";

export interface IArticle {
    articleId: number,
    author: IUser,
    title: string,
    introduction: string,
    rating: number,
    articleKeyWords: IKeyWord[],
    likes: ILike[],
    comments: IComment[],
    articlePages: number[],
    publicationDate: Date,
}