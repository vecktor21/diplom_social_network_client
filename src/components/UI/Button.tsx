import React, {FC} from 'react';
import button from '../style/Button.module.css'
interface Prop {
    children: React.ReactNode,
    onClick: ()=>void,
    disabled?: boolean
}

const Button :FC<Prop>= (props) => {
    return (
        <button
            onClick={(e:React.FormEvent<HTMLButtonElement>)=>{
                e.preventDefault()
                props.onClick()
            }}
            className={button.button}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};
export default Button;