import {IArticle} from "../types/IArticle";
import {IKeyWord} from "../types/IKeyWord";
import api from "./AxiosService";
import {IArticleCreateModel} from "../types/IArticleCreateModel";
import {IArticleUpdateModel} from "../types/IArticleUpdateModel";
import {GlobalService} from "./GlobalService";
import {PaginatedResponse} from "../types/PaginatedResponse";
import {IGroup} from "../types/IGroup";

export default class ArticlesService {
    //получить статью по айди
    static async GetArticle(id: number){
        const result = await api.get<IArticle>("/api/Articles/"+id)
        result.data.publicationDate = GlobalService.JsonDateStringToDateObj(result.data.publicationDate)
        return result
    }

    //получить статью по айди для измения (в виде IArticleUpdateModel)
    static  GetArticleForUpdate(id: number){
        const result = api.get<IArticleUpdateModel>("/api/Articles/GetArticleForupdate/"+id)
        return result
    }

    //получить все статьи автора
    static async GetArticlesByAuthor(authorId: number){
        const result =await api.get<IArticle[]>("/api/Articles/GetArticlesByAuthor?authorId="+authorId)
        result.data.forEach(article=>{
            article.publicationDate =GlobalService.JsonDateStringToDateObj(article.publicationDate)
        })
        return result
    }
    //получить рекомендации
    static async GetRecomendedArticles(userId: number){
        const result =await api.get<IArticle[]>("/api/Articles/GetRecomendedArticles?userId="+userId)
        result.data.forEach(article=>{
            article.publicationDate =GlobalService.JsonDateStringToDateObj(article.publicationDate)
        })
        return result
    }
    //поиск статей
    static async SearchArticles(search: string, page?:number,take?:number){
        if(page!=undefined&&take!=undefined){

            const result = await api.get<PaginatedResponse<IArticle>>(`/api/Articles/SearchArticles?query=${search}&page=${page}&take=${take}`)
            result.data.values.forEach(article=>{
                article.publicationDate =GlobalService.JsonDateStringToDateObj(article.publicationDate)
            })
            return result
        }else{

            const result = await api.get<PaginatedResponse<IArticle>>(`/api/Articles/SearchArticles?query=${search}`)
            result.data.values.forEach(article=>{
                article.publicationDate =GlobalService.JsonDateStringToDateObj(article.publicationDate)
            })
            return result
        }
    }
    
    //создание статьи
    static async CreateArticle(article: IArticleCreateModel){
        const result = await api.post("/api/Articles/CreateArticle", article)
        return result
    }

    //изменение статьи
    static async UpdateArticle(article: IArticleUpdateModel){
        const result = await api.post("/api/Articles/UpdateArticle", article)
        return result
    }

    //удаление статьи
    static DeleteArticle(articleId: number){
        const result = api.delete(`/api/Articles/DeleteArticle/${articleId}`)
        return result
    }
}
