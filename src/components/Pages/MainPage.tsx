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
            const tempPosts = [] as IPost[]

            FriendsService.GetFriends(userStore.user.userId).then(response=>{
                response.data.forEach(async(friend)=>{
                    try {
                        setIsLoading(true)
                        const postResponse = await UserService.GetUserPosts(friend.userId)
                        tempPosts.push(...postResponse.data)
                    }catch (e) {
                        setIsError(true)
                        setIsLoading(false)
                    }
                })
            })

            UserService.GetUserGroups(userStore.user.userId).then(response=>{
                response.data.forEach(async(group)=>{
                    try {
                        setIsLoading(true)
                        const postResponse = await GroupService.GetPosts(group.groupId)
                        tempPosts.push(...postResponse.data)
                    }catch (e) {
                        setIsError(true)
                        setIsLoading(false)
                    }
                    setIsLoading(false)
                })
            })


            tempPosts.sort((a,b)=>{
                // @ts-ignore
                return new Date(b.publicationDate.toDateString())-new Date(a.publicationDate.toDateString())
            })
            setPosts([...tempPosts])
            setIsLoading(false)
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