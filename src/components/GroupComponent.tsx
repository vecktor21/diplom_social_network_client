import React, {FC} from 'react';
import {IGroup} from "../types/IGroup";
import {useNavigate} from "react-router-dom";
import style from "./style/InfoCard.module.css";
import routes from "../consts";
import ProfileImage from "./UI/ProfileImage";
import {Size} from "../types/Size";
import consts from "../consts";
interface Props {
    Group: IGroup
}

const GroupComponent: FC<Props> = (props) => {
    const navigate = useNavigate()
    return (
        <div
            className={style.card}
            onClick={()=>{navigate(routes.GROUP_ROUTE + "?id="+props.Group.groupId)}}
        >
            <ProfileImage src={consts.API_URL + props.Group.groupImage} size={Size.medium}/>
            <div className={style.name}>
                <span>
                    {props.Group.groupName.length > 20 ?
                        props.Group.groupName.slice(0, 17) + "..."
                        :
                        props.Group.groupName}
                </span>
            </div>
        </div>
    );
};

export default GroupComponent;