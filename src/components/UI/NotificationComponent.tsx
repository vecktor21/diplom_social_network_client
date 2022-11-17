import React, {FC, ReactNode} from 'react';
import style from "../style/Notifications.module.css";
interface Props {
    children: ReactNode
}
const NotificationComponent : FC<Props> = (props) => {
    return (
        <div className={style.notification}>
            {props.children}
        </div>
    );
};

export default NotificationComponent;