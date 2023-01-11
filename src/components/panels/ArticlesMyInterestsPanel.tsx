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
import KeyWordService from '../../services/KeyWordService';
const ArticlesMyInterestsPanel = observer(() => {
    const {userStore} = useContext(Context)
    const [isLoading, setIsLoading] = useState(true)
    const [keyWords, setKeyWords] = useState([] as IKeyWord[])
    const [searchText, setSearchText] = useState("")
    const [searchedKeyWords, setSearchedKeyWords] = useState([] as IKeyWord[])
    useEffect(()=>{
        fetchKeyWords()
    },[])

    const fetchKeyWords = async ()=>{
        try{
            if(userStore?.user!= undefined || userStore?.user!= null){
                const wordResponse =await KeyWordService.GetUserKeyWords(userStore?.user.userId)
                setKeyWords(wordResponse.data)
            }
        }catch(e){
            console.log(e);
        }
        finally{
            setIsLoading(false)
        }

    }

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
    const addKeyWord = async (keyWord:IKeyWord)=>{
        // @ts-ignore
        await KeyWordService.AddKeyWordToUserInterests(keyWord.keyWordId, userStore?.user.userId)
        setKeyWords([...keyWords,keyWord])
        alert("добавлен")
    }
    const deleteKeyWord = async (keyWord:IKeyWord)=>{
        // @ts-ignore
        await KeyWordService.DeleteKeyWordFromUserInterests(keyWord.keyWordId, userStore?.user.userId)
        setKeyWords([...keyWords.filter(w=>{return w.keyWordId != keyWord.keyWordId})])
        alert("удален")
    }
    return (
        <div>
            {isLoading
            ?

                <LoadingComponent/>
            :
                <div>
                    <div className={global.pageArticle}>Мои интересы</div>
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
                                    <div key={s.keyWordId} className={global.searchResultItem}>
                                        {s.keyWordRu}
                                        <button onClick={()=>{addKeyWord(s)}}>добавить</button>
                                    </div>
                                )}
                            </div>
                            :<div></div>
                        }
                    </div>
                    <div className={global.flexBlock}>
                        {keyWords.map(w=>
                            <div key={w.keyWordId} className={style.keyWordObject} title={w.keyWordRu}>
                                <Cross className={global.cross} onClick={()=>{deleteKeyWord(w)}}/> {w.keyWordRu}
                            </div>
                        )}
                    </div>
                </div>
            }
        </div>
    );
});

export default ArticlesMyInterestsPanel;