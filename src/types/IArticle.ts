import {IKeyWord} from "./IKeyWord";
import {IAuthorInfo} from "./IAuthorInfo";
import {ILike} from "./ILike";

export interface IArticle {
    Author: IAuthorInfo
    ArticleId: number,
    Title: string,
    Introduction: string,
    Rating: number,
    Likes: ILike[]
    KeyWords: IKeyWord[]
}