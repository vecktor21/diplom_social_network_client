import { IKeyWord } from "../types/IKeyWord"
import api from "./AxiosService"

export default class KeyWordService{
    //TODO
    //перенести это в другой сервис
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
    //todo
    static AddKeyWord(keyWordId:number){

    }
    //удалить из моих интересов
    //todo
    static DeleteKeyWord(keyWordId:number){

    }
}