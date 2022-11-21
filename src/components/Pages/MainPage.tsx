import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import global from "../style/Global.module.css";
import PostComponent from "../PostComponent";
import {IPost} from "../../types/IPost";
import {Context} from "../../index";
import {IFriend} from "../../types/IFriend";
import {IGroup} from "../../types/IGroup";
import UserService from "../../services/UserService";
import PostService from "../../services/PostService";
import GroupService from "../../services/GroupService";
import post from "../style/Post.module.css";
import {FriendsService} from "../../services/FriendsService";
import LoadingComponent from "../UI/LoadingComponent";

const MainPage = observer(() => {
    const [posts, setPosts] = useState([] as IPost[])
    const [isLoading, setIsLoading] = useState(true)
    const {userStore} = useContext(Context)
    const [isLogged, setIsLogged] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(()=>{
        fetchData()

    }, [])

    const fetchData = async ()=>{
        if(userStore?.user.userId != null){
            setIsLogged(true)
            try {

                const postsResponse = await UserService.GetUserLinkedPosts(userStore?.user.userId)
                setPosts(postsResponse.data)
            }
            catch (e) {
                setIsError(true)
            }
            finally {
                setIsLoading(false)
            }
        }
        setIsLoading(false)
    }


    console.log(posts)

    //todo
    //настроить пагинацию (подгрузка постов при пролистовании)
    //todo
    //добавить сортировку к постам
    return (
        <div className={global.pageContent}>
            <div className={global.pageArticle}>
                Главная страница
            </div>
            {
                isLoading
                ?

                    <LoadingComponent/>
                :
                    isLogged
                    ?
                        <div>
                            {
                                posts.length == 0
                                ?
                                    <div>
                                        нет постов
                                    </div>
                                    :
                                        posts.map(post=>
                                            <PostComponent key={Math.random()}  post={post} /*key={post.PostId}*//>
                                        )
                            }
                        </div>
                    :
                        <div>
                            вы не вошли
                        </div>
            }

        </div>
    );
});

export default MainPage;