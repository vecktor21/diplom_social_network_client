import { IKeyWord } from "../types/IKeyWord"
import api from "./AxiosService"

export default class KeyWordService{
    //получить интересы пользователя
    static GetUserKeyWords(userId: number){
        const result = api.get<IKeyWord[]>(`/api/KeyWord/GetUserInterests?userId=${userId}`)
        return result
    }
    //поиск ключевых слов
    static SearchKeyWords(query: string){
        const result = api.get<IKeyWord[]>(`/api/KeyWord/Find?query=${query}`)
        return result
    }
    //добавить в мои интересы
    static async AddKeyWordToUserInterests(keyWordId:number, userId: number){
        await api.post(`/api/KeyWord/AddUserInterest?userId=${userId}&keyWordId=${keyWordId}`)
    }

    //удалить из моих интересов
    static async DeleteKeyWordFromUserInterests(keyWordId:number, userId: number){
        await api.post(`/api/KeyWord/RemoveUserInterest?userId=${userId}&keyWordId=${keyWordId}`)

    }
}