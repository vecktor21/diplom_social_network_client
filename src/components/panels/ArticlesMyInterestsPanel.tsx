import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {IKeyWord} from "../../types/IKeyWord";
import ArticlesService from "../../services/ArticlesService";
import {ReactComponent as Cross} from "../assets/cross-icon.svg";
import global from "../style/Global.module.css";
import style from '../style/Articles.module.css'
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import LoadingComponent from "../UI/LoadingComponent";
const ArticlesMyInterestsPanel = observer(() => {
    const {userStore} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [keyWords, setKeyWords] = useState([] as IKeyWord[])
    const [searchText, setSearchText] = useState("")
    const [searchedKeyWords, setSearchedKeyWords] = useState([] as IKeyWord[])
    useEffect(()=>{
        if(userStore?.user!= undefined || userStore?.user!= null){
            const wordResponse = ArticlesService.GetMyKeyWords(userStore?.user.userId)
            setKeyWords(wordResponse)
            setIsLoading(false)
        }
    },[])
    const searchKeyWords = ()=>{
        if(searchText.length!=0){
            setIsLoading(true)
            let text = searchText.replace(".", "")
            const keywords = text.replace(",", "").split(" ")
            const searchResponse = ArticlesService.SearchKeyWords(keywords)
            const words = searchResponse.sort()
            setSearchedKeyWords(words)
            setIsLoading(false)
        }else{
            setSearchedKeyWords([] as IKeyWord[])
        }
    }
    //todo
    const addKeyWord=(keyWord:IKeyWord)=>{
        ArticlesService.AddKeyWord(keyWord.KeyWordId)
        setKeyWords([...keyWords,keyWord])
        alert("добавлен")
    }
    //todo
    const deleteKeyWord = (keyWord:IKeyWord)=>{
        ArticlesService.DeleteKeyWord(keyWord.KeyWordId)
        setKeyWords([...keyWords.filter(w=>{return w.KeyWordId != keyWord.KeyWordId})])
        alert("удален")
    }
    return (
        <div>
            {isLoading
            ?

                <LoadingComponent/>
            :
                <div>
                    <div className={style.sectionName}>Мои интересы</div>
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
                                {searchedKeyWords.map(s=>
                                    <div key={s.KeyWordId} className={global.searchResultItem}>
                                        {s.KeyWord}
                                        <button onClick={()=>{addKeyWord(s)}}>добавить</button>
                                    </div>
                                )}
                            </div>
                            :<div></div>
                        }
                    </div>
                    <div className={global.flexBlock}>
                        {keyWords.map(w=>
                            <div key={w.KeyWordId} className={style.keyWordObject} title={w.KeyWord}>
                                <Cross className={global.cross} onClick={()=>{deleteKeyWord(w)}}/> {w.KeyWord}
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
});

export default ArticlesMyInterestsPanel;