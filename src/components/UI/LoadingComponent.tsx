import React from 'react';
import {ReactComponent as Loading} from '../assets/loading-icon.svg'
import global from '../style/Global.module.css'
const LoadingComponent = () => {
    return (
        <div className={global.loadingComponent + " " + global.pageContent}>
            <Loading className={global.loading}/>
            <div>загрузка</div>
        </div>
    )
};

export default LoadingComponent;