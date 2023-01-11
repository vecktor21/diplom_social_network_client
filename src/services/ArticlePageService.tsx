import api from "./AxiosService";
import {IArticlePage} from "../types/IArticlePage";
import {IArticlePageCreateModel} from "../types/IArticlePageCreateModel";
import {IArticlePageUpdateModel} from "../types/IArticlePageUpdateModel";
import {GlobalService} from "./GlobalService";

export class ArticlePageService {
    //получить страницу
    static async GetArticlePage(articlePageId: number){
        const result = await api.get<IArticlePage>("/api/ArticlePage/"+articlePageId)
        result.data.publicationDate =GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
    }
    //получить страницу для редактирования
    static async GetArticlePageForUpdate(articlePageId: number){
        const res = await api.get<IArticlePageUpdateModel>("/api/ArticlePage/GetArticlePageForUpdate/"+articlePageId)
        return res
    }
    //создать страницу
    static async CreateArticlePage(newArticlePage: IArticlePageCreateModel){
        const res = await api.post("/api/ArticlePage/CreateArticlePage", newArticlePage)
        return res
    }

    //изменить страницу
    static async UpdateArticlePage(articlePage: IArticlePageUpdateModel){
        const res = await api.post("/api/ArticlePage/UpdateArticlePage", articlePage)
        return res
    }
}