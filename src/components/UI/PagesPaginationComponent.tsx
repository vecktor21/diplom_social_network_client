import React, {FC, useEffect, useState} from 'react';
import global from '../style/Global.module.css'
interface Props{
    totalPages:number,
    currentPage:number,
    onPageClick:(page:number)=>void
}

const PagesPaginationComponent:FC<Props> = (props) => {
    const [pages,setPages]=useState([]as number[])
    useEffect(()=>{
        const temp=[]
        for(let i = 0; i < props.totalPages; i++){
            temp.push(i+1)
        }
        setPages(temp)
    },[])
    return (
        <div className={global.paginationPages}>
            {pages.map(p=>
                <div onClick={()=>{props.onPageClick(p)}} style={{fontWeight:props.currentPage==p?"bold":"normal"}}>{p}</div>
            )}
        </div>
    );
};

export default PagesPaginationComponent;
