import React from "react";
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'

function TextEditor({name, control, label, defaultValue=''}) {
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

            <Controller
            name={name || 'content'}
            control={control}
            render={({field: {onChange}}) => (
                <Editor
                apiKey="efh52qodwcwuat0xbvsrhf0ajfut450ijba5x9do6xdltzk2"
                initialValue={defaultValue}
                init= {{
                    initialValue:{defaultValue},
                    height: 500,
                    menubar: true,
                    plugins: [
                        "advlist", "autolink", "lists", "link", "image", "charmap", 
                                "preview", "anchor", "searchreplace", "visualblocks", "code", 
                                "fullscreen", "insertdatetime", "media", "table", "code", 
                                "help", "wordcount", "anchor"
                    ],
                    toolbar: "undo redo | formatselect | bold italic backcolor | \
                                alignleft aligncenter alignright alignjustify | \
                                bullist numlist outdent indent | removeformat | help",
                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } \
                                            ul, ol { margin-left: 20px; }"
                }}
                onEditorChange={onChange}
                />
            )}
            
            ></Controller>
        </div>
    )
}

export default TextEditor;