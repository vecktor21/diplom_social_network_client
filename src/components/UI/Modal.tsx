import style from '../style/Modal.module.css'
import React, {FC, ReactNode} from 'react';
interface Props {
    isVisible: boolean,
    children: ReactNode
    setIsVisible: (value: boolean)=>void
}
const Modal : FC<Props>= (props) => {
    return (
        <div className={`${style.modal} ${props.isVisible && style.active}`} onClick={()=>{props.setIsVisible(false)}}>
            <div onClick={(e)=>{e.stopPropagation()}} className={style.modalContent}>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;