import { createContext, useState, useEffect } from 'react'
import { type DirectoryResponse } from '../../models/file.model';
import { LanguageMapper, MonacoLanguage } from '../../utils/LanguageMap';

interface FileContextModel {
  path: string,
  setPath: React.Dispatch<React.SetStateAction<string>>,
  directory: DirectoryResponse | null,
  setDirectory: React.Dispatch<React.SetStateAction<DirectoryResponse | null>>,
  openSearch: boolean,
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>,
  update: boolean,
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  quickView: boolean,
  setQuickView: React.Dispatch<React.SetStateAction<boolean>>,
  currentFilename: string,
  setCurrentFilename: React.Dispatch<React.SetStateAction<string>>,
  isTextFile: boolean,
  setIsTextFile: React.Dispatch<React.SetStateAction<boolean>>,
  textContent: string,
  setTextContent: React.Dispatch<React.SetStateAction<string>>,
  monacoLanguage: MonacoLanguage,
  setMonacoLanguage: React.Dispatch<React.SetStateAction<MonacoLanguage>>,
  MonacoLanguages:LanguageMapper
}

export const FileContext = createContext<FileContextModel | null>(null);

interface ContextProviderParams {
  children: React.ReactNode
}

export function ContextProvider({ children }: ContextProviderParams) {
  const [path, setPath] = useState("/");
  const [directory, setDirectory] = useState<DirectoryResponse | null>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [update, setUpdate] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [currentFilename, setCurrentFilename] = useState("");
  const [isTextFile, setIsTextFile] = useState(false);
  const [textContent, setTextContent] = useState<string>("");
  const [monacoLanguage, setMonacoLanguage] = useState<MonacoLanguage>("plaintext");
  const MonacoLanguages = new LanguageMapper();
  useEffect(() => {
    fetch('http://localhost:8000/file/ls', {
      method: 'GET',
      headers: {
        "X-File-Path": path
      }
    })
      .then(x => x.json())
      .then(x => {
        setDirectory(x)
      });
  }, [path, update])
  return (
    <FileContext.Provider value={{
      path, setPath,
      directory, setDirectory,
      openSearch, setOpenSearch,
      update, setUpdate,
      quickView, setQuickView,
      currentFilename, setCurrentFilename,
      isTextFile, setIsTextFile,
      textContent, setTextContent,
      monacoLanguage, setMonacoLanguage,
      MonacoLanguages
    }}>
      {children}
    </FileContext.Provider>
  )
}