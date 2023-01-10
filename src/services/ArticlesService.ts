import {IArticle} from "../types/IArticle";
import {IKeyWord} from "../types/IKeyWord";
import api from "./AxiosService";
import {IArticleCreateModel} from "../types/IArticleCreateModel";
import {IArticleUpdateModel} from "../types/IArticleUpdateModel";

export default class ArticlesService {
    //получить статью по айди
    static GetArticle(id: number){
        const result = api.get<IArticle>("/api/Articles/"+id)
        return result
    }

    //получить статью по айди для измения (в виде IArticleUpdateModel)
    static GetArticleForUpdate(id: number){
        const result = api.get<IArticleUpdateModel>("/api/Articles/GetArticleForupdate/"+id)
        return result
    }

    //получить все статьи автора
    static GetArticlesByAuthor(authorId: number){
        const result = api.get<IArticle[]>("/api/Articles/GetArticlesByAuthor?authorId="+authorId)
        return result
    }
    //получить рекомендации
    static GetRecommendedArticlesByAuthor(userId: number):IArticle[]{
        var articles = [] as IArticle[]
        // for(let i = 0; i <4; i++){
        //     articles.push(this.GetArticle(i))
        // }
        return articles
    }
    //поиск статей
    static SearchArticles(query: string){
        const result = api.get<IArticle[]>(`/api/Articles/SearchArticles?query=${query}`)
        return result
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