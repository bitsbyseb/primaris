import { Editor } from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { FileContext } from "../FileContext";
import { FileService } from "../../services/FileService/File.service";

function Index() {
    const context = useContext(FileContext);
    if (!context) return;
    const {setQuickView,currentFilename,textContent,setTextContent,monacoLanguage,setMonacoLanguage,path,MonacoLanguages} = context;
    const {getFileContent} = FileService;
    const [onload,setOnload] = useState(false);
    useEffect(() => {
        getFileContent({
            filename:currentFilename,
            isTextFile:true,
            path
        }).
        then((x) => {
            if (!x) return;
            const language = MonacoLanguages.getLanguage(currentFilename);
            setMonacoLanguage(language);
            setTextContent(x);
            setOnload(true); 
        });
    });
    return (
        onload && <div>
            <div className='w-full h-10 flex items-center justify-between'>
                <h2 className='text-2xl text-secondary font-bold'>{currentFilename}</h2>
                <button onClick={() => {
                    setQuickView(false);
                }} className='text-4xl text-primary font-bold bg-secondary active:text-secondary active:bg-primary cursor-pointer rounded-lg'>
                    <TiDelete />
                </button>
            </div>
            {
                <Editor width={"50vw"} theme='vs-dark' options={{ readOnly: true }} height={"40vh"} defaultLanguage={monacoLanguage} value={textContent} />
            }
        </div>
    )
}

export default Index;