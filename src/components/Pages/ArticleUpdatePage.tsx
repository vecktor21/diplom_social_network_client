import React, {useEffect, useState} from 'react';
import {IArticle} from "../../types/IArticle";
import {useNavigate, useParams} from "react-router-dom";
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import KeyWordService from "../../services/KeyWordService";
import {IKeyWord} from "../../types/IKeyWord";
import {IArticleUpdateModel} from "../../types/IArticleUpdateModel";
import Modal from "../UI/Modal";
import style from "../style/Articles.module.css";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import TextEditor from "../UI/TextEditor";
import ArticlesService from "../../services/ArticlesService";
import LikeService from "../../services/LikeService";
import consts from "../../consts";

const ArticleUpdatePage = () => {
    const [article, setArticle] = useState({} as IArticleUpdateModel)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const params = useParams()
    const [isKeyWordsModalVisible, setIsKeyWordsModalVisible] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchedKeyWords, setSearchedKeyWords] = useState([] as IKeyWord[])
    const [keyWordsToAdd, setKeyWordsToAdd] = useState([] as IKeyWord[])
    const navigate = useNavigate()

    useEffect(()=>{
        fetchArticles()
    },[])

    const fetchArticles = async ()=>{
        // @ts-ignore
        const response = await ArticlesService.GetArticleForUpdate(params.articleId)
        try{
            setArticle(response.data)
        }catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false)
        }

    }
    //поиск ключевых слов
    const searchKeyWords = async ()=>{
        if(searchText.length!=0){
            try{
                setIsLoading(true)
                const searchResponse = await KeyWordService.SearchKeyWords(searchText)
                const words = searchResponse.data.sort()
                setSearchedKeyWords(words)
            }catch(e){
                console.log(e);
            }finally{
                setIsLoading(false)
            }
        }else{
            setSearchedKeyWords([] as IKeyWord[])
        }
    }
    //удалить ключевое слово
    const deleteKeyWord = (word: IKeyWord)=>{
        setArticle({...article, keyWords: [...article.keyWords.filter(w=>{return w != word.keyWordId})]})
        setKeyWordsToAdd([...keyWordsToAdd.filter(w=>{return w.keyWordId != word.keyWordId})])

    }

    //изменить статью
    const updateArticle = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        try{
            const res = await ArticlesService.UpdateArticle(article)
            console.log(res.data)
            alert("Статья сохранена")
            navigate(consts.ARTICLE_NAVIGATION_ROUTE+"/"+params.articleId)

        }catch (e) {
            console.log(e)
        }
    }
    return (
        <div className={global.pageContent}>
            {isLoading
                ?
                <div>
                    <LoadingComponent/>
                </div>
                :
                <div>
                    {isError
                        ?

                        <ErrorComponent/>
                        :

                        <div className={global.mainSection}>
                            <Modal isVisible={isKeyWordsModalVisible} setIsVisible={setIsKeyWordsModalVisible}>
                                <div className={style.searchBlock + " " + global.searchBlock}>
                                    <Logo id="find" className={global.find} onClick={searchKeyWords}/>
                                    <input
                                        value={searchText}
                                        placeholder={"поиск"}
                                        onChange={(e)=>{setSearchText(e.target.value)}}
                                        onKeyDown={(e)=>{
                                            if(e.key.toLowerCase()=="enter"){
                                                searchKeyWords()
                                            }
                                        }}
                                    />
                                    {searchedKeyWords.length>0
                                        ?
                                        <div className={global.searchResult}>
                                            {searchedKeyWords.map(word=>
                                                <div key={word.keyWordId} className={global.searchResultItem}>
                                                    {word.keyWordRu}
                                                    <button onClick={()=>{
                                                        setKeyWordsToAdd((k)=>[...k, word])
                                                        setArticle({...article, keyWords: [...article.keyWords, word.keyWordId]})
                                                    }}>добавить</button>
                                                </div>
                                            )}
                                        </div>
                                        :<div></div>
                                    }
                                </div>
                            </Modal>
                            <div className={global.pageArticle}>создание статьи</div>
                            <div>заполните следующие поля для </div>
                            <div>
                                <label htmlFor="title">
                                    название статьи
                                </label>
                                <input type="text" id="title" name="title"
                                       value={article.title}
                                       onChange={(e)=>{
                                           setArticle({...article, title: e.target.value})
                                       }}/>
                            </div>
                            <div>
                                <button onClick={(e)=>{
                                    e.preventDefault()
                                    setIsKeyWordsModalVisible(true)
                                }}>добавить ключевые слова</button>
                                <div>ключевые слова:</div>
                                <div>
                                    {keyWordsToAdd.map(w=>
                                        <div key={w.keyWordId} className={style.keyWordObject} title={w.keyWordRu}>
                                            <Cross className={global.cross} onClick={()=>{deleteKeyWord(w)}}/> {w.keyWordRu}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div><TextEditor text={article.introduction} setText={(newText)=>{
                                setArticle({...article, introduction: newText})
                            }
                            }/></div>

                            <button onClick={updateArticle}>сохранить изменения</button>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default ArticleUpdatePage;