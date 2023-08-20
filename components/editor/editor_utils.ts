import { v4 as uuidv4 } from 'uuid';

import { GistData } from '@/lib/types/gist';
import { Tab, TabsView } from '@/lib/types/zist';
import { extensionToLanguage } from '@/lib/constants/language';

export const tabsValue: TabsView = {
  MARKDOWN: {
    key: 'text/markdown',
    value: 'Markdown',
  },
  CODE: {
    key: 'text/code',
    value: 'Code',
  },
};

export const handleFileNameChange = (
  fileId: string | null,
  value: string,
  gistData: GistData,
  setGistData: React.Dispatch<React.SetStateAction<GistData>>
) => {
  const updatedFiles = gistData.files.map((file) =>
    file.id === fileId ? { ...file, filename: value } : file
  );

  setGistData({
    ...gistData,
    files: updatedFiles,
  });
};

export const handleFileContentChange = (
  fileId: string | null,
  value: string,
  gistData: GistData,
  setGistData: React.Dispatch<React.SetStateAction<GistData>>
) => {
  const updatedFiles = gistData.files.map((file) =>
    file.id === fileId ? { ...file, content: value } : file
  );

  setGistData({
    ...gistData,
    files: updatedFiles,
  });
};

export const handleFileTypeChange = (
  fileId: string | null,
  type: string,
  gistData: GistData,
  setGistData: React.Dispatch<React.SetStateAction<GistData>>
) => {
  console.log('FILE NOW', fileId, type);
  const updatedFiles = gistData.files.map((file) =>
    file.id === fileId
      ? {
          ...file,
          type: type,
          language: type === 'text/markdown' ? 'Markdown' : 'Code',
        }
      : file
  );

  setGistData({
    ...gistData,
    files: updatedFiles,
  });
};

export const addNewFile = (
  gistData: GistData,
  setGistData: React.Dispatch<React.SetStateAction<GistData>>,
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentActiveTab: React.Dispatch<React.SetStateAction<Tab>>
) => {
  const newFileId = uuidv4();

  setGistData({
    ...gistData,
    files: [
      ...gistData.files,
      {
        id: newFileId,
        filename: '',
        content: '',
        type: 'text/code',
        language: 'Code',
      },
    ],
  });
  setCurrentActiveTab(tabsValue.CODE);
  setSelectedFileId(newFileId);
};

export const removeFile = (
  fileId: string | null,
  gistData: GistData,
  setGistData: React.Dispatch<React.SetStateAction<GistData>>,
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentActiveTab: React.Dispatch<React.SetStateAction<Tab>>
) => {
  const updatedFiles = gistData.files.filter((file) => file.id !== fileId);

  setGistData({
    ...gistData,
    files: updatedFiles,
  });

  const type = updatedFiles.length > 0 ? updatedFiles[0].type : '';
  const id = updatedFiles.length > 0 ? updatedFiles[0].id : '';
  console.log('VALUES HERE', id, type);
  handleSelectFile(id, type, setSelectedFileId, setCurrentActiveTab);
};

export const handleSelectFile = (
  value: string,
  type: string,
  setSelectedFileId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentActiveTab: React.Dispatch<React.SetStateAction<Tab>>
) => {
  setSelectedFileId(value);
  setCurrentActiveTab(
    type === tabsValue.MARKDOWN.key ? tabsValue.MARKDOWN : tabsValue.CODE
  );
};

export const createPayload = (gistData: GistData) => {
  const payload = {
    description: gistData.description,
    public: false,
    files: gistData.files.reduce((result: Record<string, any>, file, index) => {
      result[file.filename || `file${index + 1}`] = {
        filename: file.filename || `file${index + 1}`,
        content: file.content,
        language: extensionToLanguage[file.language.split('.').pop() as string],
      };
      return result;
    }, {}),
  };

  return payload;
};
