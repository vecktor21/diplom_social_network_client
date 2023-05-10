import React, {useState} from 'react';
import global from "./style/Global.module.css";
import {ReactComponent as Logo} from "./assets/find-icon.svg";
import {useNavigate} from "react-router-dom";
import consts from "../consts";

const MainSearchComponent = () => {
    const navigate = useNavigate()
    const [search,setSearch]=useState("")
    return (
        <div>
            <div className={global.searchBlock}>
                <Logo id="find" className={global.find}/>
                <input type="text" placeholder="поиск" value={search} onChange={(e)=>{setSearch(e.target.value)}} onKeyDown={(e)=>{
                    if(e.key.toLowerCase()=="enter"){
                        navigate(consts.SEARCH_ROUT+"?search="+search)
                        setSearch("")

                    }
                }}/>
            </div>
            <div>

            </div>
        </div>
    );
};

export default MainSearchComponent;
