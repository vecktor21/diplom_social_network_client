import {Size} from '../../types/Size'
import React, {useEffect, useState} from 'react';
import global from '../style/Global.module.css'
import {observer} from "mobx-react-lite";
import {useNavigate, useSearchParams} from "react-router-dom";
import {IFriend} from "../../types/IFriend";
import FriendComponent from "../FriendComponent";
import {FriendsService} from "../../services/FriendsService";
import style from "../style/Articles.module.css";
import {ReactComponent as Logo} from "../assets/find-icon.svg";
import ProfileImage from "../UI/ProfileImage";
import consts from "../../consts";
import routes from "../../consts";
import LoadingComponent from "../UI/LoadingComponent";
import ErrorComponent from "../UI/ErrorComponent";

const FriendsPage = observer(() => {
    const [params] = useSearchParams()
    const id = Number(params.get("id"))
    const [isError, setIsError] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [friends, setFriends] = useState([] as IFriend[])
    const [foundFriends, setFoundFriends] = useState([] as IFriend[])
    const navigate = useNavigate()

    const searchFriends = ()=>{
        setIsSearchLoading(true)
        FriendsService.FindFriends(searchText)
            .then(data=>{
                setFoundFriends(data)
                //console.log(data)
                setIsSearchLoading(false)
            })
    }

    useEffect(()=>{
        if(id!=null){
            setIsLoading(true)
            FriendsService.GetFriends(id)
                .then(response=>{
                    console.log("response.data (before): ")
                    console.log(response.data)
                    response.data.sort((a, b)=>{
                        if(a.name<b.name){
                            return -1
                        }
                        else if(a.name==b.name){
                            return 0
                        }
                        else{
                            return 1
                        }
                    })
                    console.log("response.data (after): ")
                    console.log(response.data)
                    setFriends(response.data)
                    setIsLoading(false)
                })
            setIsError(false)
        }else {
            setIsError(true)
        }
    }, [])
    /*console.log("friends: " )
    console.log(friends)*/
    return (
        <div className={global.pageContent}>

            {isLoading
                ?
                <LoadingComponent/>
                :

                isError
                ?

                    <ErrorComponent/>
                :
                    <div className={global.mainSection}>
                        <div className={global.pageArticle}>Ваши друзья</div>
                        <div>
                            <div className={global.searchBlockInSection + " " + global.searchBlock}>
                                <Logo id="find" className={global.find} onClick={searchFriends}/>
                                <input
                                    value={searchText}
                                    placeholder={"поиск друзей"}
                                    onChange={(e)=>{setSearchText(e.target.value)}}
                                    onKeyDown={(e)=>{
                                        if(e.key.toLowerCase()=="enter"){
                                            searchFriends()
                                        }
                                    }}
                                />
                            </div>
                            {searchText==""
                                ?
                                <div>начните вводить текст чтобы найти людей</div>
                                :
                                <div>
                                    {
                                        isSearchLoading
                                            ?
                                            <LoadingComponent/>
                                            :
                                            <div>
                                                {foundFriends.map(a=>
                                                    <div key={a.userId}
                                                         onClick={()=>{navigate(consts.USER_PAGE_ROUTE + "?id=" + a.userId)}}
                                                    >
                                                        {/*<ProfileImage src={`${consts.API_URL}/${a.profileImage}`} size={Size.small}/>*/}
                                                        {`${a.name} ${a.surname} ${a.nickname}`}
                                                    </div>
                                                )}
                                            </div>
                                    }
                                </div>
                            }
                        </div>
                        {friends.length==0
                            ?
                            <div  >у вас еще нет друзей. найдите друзей при помощи поиска и отправьте им запрос в друзья</div>
                            :
                            <div className={global.gridView} >
                                {friends.map(friend=>
                                    <FriendComponent Friend={friend}/>
                                )}
                            </div>
                        }
                    </div>
            }
        </div>
    );
});

export default FriendsPage;