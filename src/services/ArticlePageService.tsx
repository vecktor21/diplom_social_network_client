import api from "./AxiosService";
import {IArticlePage} from "../types/IArticlePage";

export class ArticlePageService {
    static async GetArticlePage(articlePageId: number){
        const res = await api.get<IArticlePage>("/api/ArticlePage/"+articlePageId)
        return res
    }
}