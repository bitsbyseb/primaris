import { FaFile } from "react-icons/fa";
import { GoFileDirectory } from "react-icons/go";
import { FileService } from "../../services/FileService/File.service";
import { IoMdDownload } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { useContext } from "react";
import { FileContext } from "../FileContext";
import { DirectoryResponse, FileResponse } from "../../models/file.model";

interface FileProps {
    isDirectory: boolean,
    filename: string,
    anchorID: string
    instance: FileResponse | DirectoryResponse
}

function Index({ isDirectory,filename, anchorID, instance }: FileProps) {
    const { deleteFile, downloadCallback } = FileService;
    const context = useContext(FileContext);
    if (context) {
        const {setCurrentFilename,setQuickView,path,setPath,update,setUpdate} = context;
        return (
            <div className='w-[28rem] h-24 border-2 border-secondary flex justify-between items-center rounded-lg gap-5 px-5' key={filename}>
                <div className='w-auto h-full flex items-center justify-between'>
                    <div className="image w-1/3 h-full text-secondary text-7xl grid place-items-center">
                        {
                            isDirectory ? <GoFileDirectory /> : <FaFile />
                        }
                    </div>
                    <div className="info text-2xl text-secondary">
                        {
                            isDirectory ? <a className='overflow-x-scroll' onClick={() => {
                                setPath(`${path}${filename}/`);
                            }}>{filename}</a> :
                            <a onClick={() => {
                                    setQuickView(true);
                                    setCurrentFilename(filename);
                                }} className='overflow-x-scroll text-wrap'>{filename}</a>
                        }
                        {
                            !isDirectory && <a className="hidden" id={anchorID}></a>
                        }
                    </div>
                </div>
                <div className='w-auto buttons flex flex-col text-3xl justify-center items-center'>
                    {
                        !isDirectory && <div className="download w-full h-1/2 grid place-items-center">
                            <button className='text-secondary cursor-pointer active:scale-110' onClick={async () => {
                                await downloadCallback(path, instance.name, anchorID);
                            }}>
                                <IoMdDownload />
                            </button>
                        </div>
                    }
                    <div className="remove w-full h-1/2 grid place-items-center">
                        <button className='text-secondary cursor-pointer active:scale-110' onClick={async () => {
                            const response = prompt("are you sure you want to delete this resource?");
                            if (response?.toLocaleLowerCase() === "no" || !response) {
                                return;
                            }
                            await deleteFile(path, instance);
                            setUpdate(!update);
                        }}>
                            <TiDelete />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

}

export default Index;