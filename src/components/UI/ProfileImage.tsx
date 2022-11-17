import React, {FC, useEffect, useState} from 'react';
import {Size} from "../../types/Size";
//import img from "../../Placeholders/imgPlaceholder.png"
import image from '../style/Image.module.css'
interface Props {
    src:string,
    size: Size
}
const ProfileImage :FC<Props> = (props) => {
    const [className, setClassName] = useState("")
    useEffect(()=>{
        switch (props.size) {
            case Size.small:
                setClassName(image.small)
                break;
            case Size.medium:
                setClassName(image.medium)
                break;
            case Size.large:
                setClassName(image.large)
                break;
        }
    })
    return (
        <img src={props.src} className={className + " " + image.profileImage}/>
    );
};

export default ProfileImage;