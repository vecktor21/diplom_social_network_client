import React from 'react';
import global from "./style/Global.module.css";
import {ReactComponent as Logo} from "./assets/find-icon.svg";

const MainSearchComponent = () => {
    return (
        <div>
            <div className={global.searchBlock}>
                <Logo id="find" className={global.find}/>
                <input type="text" placeholder="поиск"/>
            </div>
            <div>

            </div>
        </div>
    );
};

export default MainSearchComponent;
