import React, {FC} from 'react';
import Modal from "./Modal";
import {setFips} from "crypto";

interface Props {
    isVisible: boolean,
    setIsVisible: (bool: boolean)=>void,
    files: File[],
    setFiles: (files: File[]) =>void,
    uploadHandler: ()=>void
}

const FileUploadComponent : FC<Props> = (props) => {
    return (
        <Modal isVisible={props.isVisible} setIsVisible={props.setIsVisible}>
            <input type="file" multiple onChange={e=>{props.setFiles(Array.prototype.slice.call(e.target.files))}}/>
            <button
                onClick={()=>{props.uploadHandler()}}
            >
                загрузить файлы
            </button>
        </Modal>
    );
};

export default FileUploadComponent;