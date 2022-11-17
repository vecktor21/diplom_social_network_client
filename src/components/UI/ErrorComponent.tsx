import React from 'react';
import {ReactComponent as Error} from '../assets/error-icon.svg'
import global from '../style/Global.module.css'
const ErrorComponent = () => {
    return (
        <div className={global.errorComponent + " " + global.pageContent}>
            <Error className={global.error}/>
            <div>ошибка</div>
        </div>
    );
};

export default ErrorComponent;