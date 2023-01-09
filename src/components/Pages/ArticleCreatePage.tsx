import React, {MouseEventHandler, useContext, useEffect, useState} from 'react';
import global from "../style/Global.module.css";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";
import Modal from "../UI/Modal";
import FileUploadComponent from "../UI/FileUploadComponent";
import {ReactComponent as Heart} from "../assets/heart-icon.svg";
import style from "../style/Articles.module.css";
import parse from "html-react-parser";
import PostService from "../../services/PostService";
import TextEditor from "../UI/TextEditor";
import {IArticle} from "../../types/IArticle";
import {IArticleCreateModel} from "../../types/IArticleCreateModel";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import KeyWordService from "../../services/KeyWordService";
import {IKeyWord} from "../../types/IKeyWord";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import {Context} from "../../index";
import {log} from "util";
import ArticlesService from "../../services/ArticlesService";

const ArticleCreatePage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [newArticle, setNewArticle] = useState({authorId: 0, introduction: "", title:"", keyWords:[]} as IArticleCreateModel)
    const [isKeyWordsModalVisible, setIsKeyWordsModalVisible] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchedKeyWords, setSearchedKeyWords] = useState([] as IKeyWord[])
    const [keyWordsToAdd, setKeyWordsToAdd] = useState([] as IKeyWord[])
    const {userStore} = useContext(Context)

    useEffect(()=>{
        if(userStore?.user.userId){
            setNewArticle({...newArticle, authorId: userStore?.user.userId})
        }
    }, [])

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
        setNewArticle({...newArticle, keyWords: [...newArticle.keyWords.filter(w=>{return w != word.keyWordId})]})
        setKeyWordsToAdd([...keyWordsToAdd.filter(w=>{return w.keyWordId != word.keyWordId})])

    }
    //создать статью
    const createArticle = async (e: React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        try{
            const res = await ArticlesService.CreateArticle(newArticle)
            console.log(res.data)
            alert("Статья создана")
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
                                                        setNewArticle({...newArticle, keyWords: [...newArticle.keyWords, word.keyWordId]})
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
                                       value={newArticle.title}
                                       onChange={(e)=>{
                                           setNewArticle({...newArticle, title: e.target.value})
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
                            <div><TextEditor text={newArticle.introduction} setText={(newText)=>{
                                setNewArticle({...newArticle, introduction: newText})
                            }
                            }/></div>

                            <button onClick={createArticle}>создать</button>
                        </div>

                    }
                </div>
            }
        </div>
    );
};

export default ArticleCreatePage;