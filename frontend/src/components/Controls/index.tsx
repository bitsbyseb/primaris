import { FaArrowTurnUp } from "react-icons/fa6";
import { FileService } from "../../services/FileService/File.service";
import { useContext } from "react";
import { FileContext } from "../FileContext";

const {goUpPath,createDirectory} = FileService;
function Index() {
    const context = useContext(FileContext);
    if (!context) {
        return;
    }

    const {path,setPath,setOpenSearch,openSearch,update,setUpdate} = context;
    return (
        <div className="w-1/2 flex justify-between mb-10 gap-20">
            <h2 className="w-auto path px-5 text-secondary border-4 border-secondary font-bold grid place-items-center">Path: {path}</h2>
            <div className="create w-auto flex items-center space-x-5">

                <button onClick={() => setPath(goUpPath(path))} className='w-16 h-11 rounded-lg border-4 cursor-pointer active:scale-110 border-secondary text-primary bg-secondary active:text-secondary active:bg-primary grid place-items-center'>
                    <FaArrowTurnUp />
                </button>

                <button className="upload action-button" onClick={() => setOpenSearch(!openSearch)}>Upload</button>

                <button className="mkdir action-button" onClick={async () => {
                    const dirname = prompt("directory name");
                    if (dirname) {
                        await createDirectory(dirname, path);
                    }
                    setUpdate(!update);
                }}>Create Dir</button>
            </div>
        </div>
    )
}

export default Index;