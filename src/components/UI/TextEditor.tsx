import React, {FC, useState} from 'react';
import {Editor} from "react-draft-wysiwyg";
import {EditorState, ContentState, convertToRaw, convertFromRaw, convertFromHTML} from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

interface Props {
    text: string,
    setText: (val: string)=>void
}

const TextEditor : FC<Props>= (props) => {
    //draft js
    // @ts-ignore
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(props.text))))
    return (

        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={(newState)=>{
                    setEditorState(newState)
                    props.setText(draftToHtml(convertToRaw(newState.getCurrentContent())))
                }
                }
            />
        </div>
    );
};

export default TextEditor;