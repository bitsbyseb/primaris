import { useContext } from 'react'
import FormModal from '../Form';
import Editor from '../Editor';
import { FileContext } from '../FileContext';
import { FileService } from '../../services/FileService/File.service';
import UploadForm from '../UploadForm';
import FileElement from '../File';
import Controls from '../Controls';

const isDirectory = FileService.isDirectory;
function App() {
  const context = useContext(FileContext);
  if (!context) {
    return;
  }
  const { directory, openSearch,quickView } = context;
  return (
    <div className='w-full min-h-screen bg-primary flex flex-col items-center space-y-5 pt-10'>
      <h2 className='text-4xl text-secondary font-bold'>Home Cloud</h2>
      <Controls />

      {
        quickView && <FormModal>
          <Editor/>
        </FormModal>
      }

      {
        openSearch && <FormModal>
          <UploadForm/>
        </FormModal>
      }
      {
        directory && <section className='w-full h-full pb-10 px-5 grid grid-cols-3 gap-10 place-items-center'>
          {
            directory.children.map(x => {
              const anchorID = 'file' + crypto.randomUUID();
              return (
                <FileElement key={x.name} anchorID={anchorID} filename={x.name} instance={x} isDirectory={isDirectory(x)} />
              );
            })
          }
        </section>
      }
    </div>
  )
}

export default App
