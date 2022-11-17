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
    const [userFriends, setUserFriends] = useState([] as IFriend[])
    const [userGroups, setUserGroups] = useState([] as IGroup[])
    useEffect(()=>{


    }, [])

    const fetchData = async ()=>{
        if(userStore?.user.userId != null){
            setIsLogged(true)
            const tempPosts = [] as IPost[]

            FriendsService.GetFriends(userStore.user.userId).then(response=>{
                setUserFriends(response.data)
                response.data.forEach(friend=>{
                    const postResponse = UserService.GetUserPosts(friend.userId)
                    tempPosts.push(...postResponse)
                })
                setIsLoading(false)
            })
            const groupResponse = await UserService.GetUserGroups(userStore.user.userId)
            setUserGroups(groupResponse.data)


            groupResponse.data.forEach(group=>{
                const postResponse = GroupService.GetPosts(group.groupId)
                tempPosts.push(...postResponse)
            })
            tempPosts.sort((a,b)=>{
                // @ts-ignore
                return new Date(b.publicationDate.toDateString())-new Date(a.publicationDate.toDateString())
            })
            setPosts([...tempPosts])
        }
        setIsLoading(false)
    }

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