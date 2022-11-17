import {IArticle} from "../types/IArticle";
import {IKeyWord} from "../types/IKeyWord";

export default class ArticlesService {
    static GetArticle(id: number):IArticle{
        var num = Math.floor(Math.random()*100)
        return{
            ArticleId: num,
            Author:{
                authorId: id,
                name: "some author",
                img: ""
            },
            Likes: [{
                likeId: 312,
                likedUserId: 1,
                objectId: num
            }],
            Rating: 5,
            Introduction: "some introduction to this article",
            KeyWords: [
                {
                    KeyWordId: 312,
                    KeyWord: "Информационные системы"
                },
                {
                    KeyWordId: 2,
                    KeyWord: "Веб Технологии"
                }
            ],
            Title: "this is title for this article this is title for this articlethis is title for thiss articlethis is title for this articlethis is title for this articlethis is title for this article",
        }
    }
    static GetArticlesByAuthor(authorId: number):IArticle[]{
        var articles = [] as IArticle[]
        for(let i = 0; i <4; i++){
            articles.push(this.GetArticle(authorId))
        }
        return articles
    }
    static GetRecommendedArticlesByAuthor(userId: number):IArticle[]{
        var articles = [] as IArticle[]
        for(let i = 0; i <4; i++){
            articles.push(this.GetArticle(i))
        }
        return articles
    }
    static SearchArticles(searchText: string, keyWords: string[]):IArticle[]{
        const articles = [] as IArticle[]
        for (let i = 0; i < keyWords.length; i ++){
            articles.push(this.GetArticle(i))
        }
        return articles
    }
    static GetMyKeyWords(userId: number) : IKeyWord[]{
        const words = [] as IKeyWord[]
        for(let i = 0; i < 20; i++){
            words.push({
                    KeyWordId: i,
                    KeyWord: "key words key words key words key words key words key words key words  key words key words key words key words key words key words " + i
            })
        }
        return words
    }
    static SearchKeyWords(serchText: string[]):IKeyWord[]{
        const words = [] as IKeyWord[]
        for (let i = 0; i < serchText.length; i ++){
            words.push({
                KeyWordId: i,
                KeyWord: "key words" + i
            })
        }
        return words
    }
    //todo
    static AddKeyWord(keyWordId:number){

    }
    //todo
    static DeleteKeyWord(keyWordId:number){

    }
}