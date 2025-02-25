import { useContext } from "react";
import { FileService } from "../../services/FileService/File.service"
import { FileContext } from "../FileContext";

function Index() {
    const context = useContext(FileContext);
    if (!context) return;
    const {uploadFile} = FileService;
    const {path,setQuickView,setUpdate,update} = context;
    return (
        <form id='upload'
            onSubmit={async e => {
                e.preventDefault();
                await uploadFile(path, e.currentTarget);
                setQuickView(false);
                setUpdate(!update);
            }}
            className='w-full h-full text-white text-2xl flex justify-center pl-10 flex-col gap-4 items-start'>
            <label htmlFor="files[]" className='text-secondary text-2xl font-bold'>upload your file:</label>
            <input type="file" multiple name="files[]" id="files[]" required />
            <button className='action-button w-52 h-16'>upload</button>
        </form>
    )
}

export default Index;