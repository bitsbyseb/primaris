import { useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router';
import FormModal from '../Form';
import Editor from '../Editor';
import { FileContext } from '../FileContext';
import UploadForm from '../UploadForm';
import FileElement from '../File';
import Controls from '../Controls';
import { AuthService } from '../../services/AuthService';


function App() {
  const context = useContext(FileContext);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!context) {
    return null;
  }

  if (!isAuthenticated) {
    console.log("Not Authenticated:",isAuthenticated);
    return <Navigate to="/login" />;
  }

  const { directory, openSearch, quickView } = context;

  return (
    <div className='w-full min-h-[100dvh] bg-primary flex flex-col items-center space-y-5 pt-10'>
      <div className='flex justify-between w-full max-w-7xl px-5'>
        <h2 className='text-4xl text-secondary font-bold'>Primaris</h2>
        <button 
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors cursor-pointer active:scale-110'
        >
          Cerrar Sesión
        </button>
      </div>
      <Controls />

      {quickView && (
        <FormModal>
          <Editor />
        </FormModal>
      )}

      {openSearch && (
        <FormModal>
          <UploadForm />
        </FormModal>
      )}

      {directory && (
        <section className='w-full h-[100dvh] pb-10 px-5 gap-10 DirectoryContent'>
          {directory.children.map((file) => {
            if (file.name.startsWith(".")) {
                return;
            }
            return (
            <FileElement 
              key={file.name} 
              isDirectory={file.isDirectory}
              filename={file.name}
              anchorID={file.name}
              instance={file}
            />)
          })}
        </section>
      )}
    </div>
  );
}

export default App
