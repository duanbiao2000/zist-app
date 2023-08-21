`use client`;

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineDelete } from 'react-icons/ai';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Tab } from '@/lib/types/zist';
import { GistData } from '@/lib/types/gist';
import { usePostGist } from '@/lib/hooks/useGists';

import Tiptap from '../tiptap';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import FileSelector from '../filters/file-selector';
import TabsContentWrapper from '../ui/tabs-content-wrapper';
import PrivateFilter from '../filters/private-filter';

import CreateCodeContainer from './CreateCodeContainer';
import {
  addNewFile,
  createPayload,
  handleFileContentChange,
  handleFileNameChange,
  handleFileTypeChange,
  handleSelectFile,
  randomFileNamesWithExtension,
  removeFile,
  tabsValue,
} from './editor_utils';

const defaultNewFile = {
  id: uuidv4(),
  filename:
    randomFileNamesWithExtension[
      Math.floor(Math.random() * randomFileNamesWithExtension.length)
    ],
  content: '',
  type: 'text/code',
  language: 'Code',
};

function CodeAndMarkdownWrapper() {
  const [currentActiveTab, setCurrentActiveTab] = useState<Tab>(tabsValue.CODE);

  const [remountKey, setRemountKey] = useState(1);

  const { mutateAsync: postGist, isLoading: isPosting } = usePostGist();

  const [gistData, setGistData] = useState<GistData>({
    description: '',
    public: false,
    files: [defaultNewFile],
  });

  const [selectedFileId, setSelectedFileId] = useState<string | null>(
    gistData.files.length > 0 ? gistData.files[0].id : null
  );

  const handleTabChange = (value: Tab) => {
    setCurrentActiveTab(value);
    handleFileTypeChange(selectedFileId, value.key, gistData, setGistData);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGistData({
      ...gistData,
      description: e.target.value,
    });
  };

  const _handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileNameChange(
      selectedFileId,
      e?.target.value,
      gistData,
      setGistData
    );
  };

  const _handleFileContentChange = (value: string | undefined) => {
    handleFileContentChange(selectedFileId, value || '', gistData, setGistData);
  };

  const _handleFileContentChangeMD = (value: string) => {
    handleFileContentChange(selectedFileId, value, gistData, setGistData);
  };

  const _handleAddNewFile = () => {
    addNewFile(gistData, setGistData, setSelectedFileId, setCurrentActiveTab);
  };

  const _handleSelectFile = (value: string) => {
    const selectedFileType = gistData.files.filter((item) => item.id === value);
    const type = selectedFileType[0].type;
    setRemountKey((previousValue) => previousValue + 1);
    handleSelectFile(value, type, setSelectedFileId, setCurrentActiveTab);
  };

  const _handleDeleteFile = () => {
    removeFile(
      selectedFileId,
      gistData,
      setGistData,
      setSelectedFileId,
      setCurrentActiveTab
    );
  };

  const _handleSaveFiles = async () => {
    const data = createPayload(gistData as GistData);
    await postGist(data);
  };

  const _handleTypeToggle = (value: boolean) => {
    setGistData({
      ...gistData,
      public: !value,
    });
  };

  return (
    <div className="w-[85%] ml-6">
      <div className="flex items-center space-x-4">
        <Input
          onChange={handleDescriptionChange}
          value={gistData.description}
          type="text"
          name="description"
          id="description"
          placeholder="File Description..."
          className="w-full p-2 mt-2 mb-2 rounded-l"
        />
        <PrivateFilter
          checked={!gistData.public}
          onChange={_handleTypeToggle}
        />
      </div>
      <div className="flex items-center mt-2 mb-2 w-30 space-x-2 hover:border-red-500">
        <Input
          type="text"
          name="name"
          id="name"
          value={
            gistData.files.find((file) => file.id === selectedFileId)
              ?.filename || ''
          }
          onChange={(e) => _handleFileNameChange(e)}
          placeholder="File Name"
          className="mt-2 mb-2 w-30"
        />

        {gistData.files.length > 1 && (
          <button
            title="delete this files"
            onClick={_handleDeleteFile}
            className="flex items-center text-red-500"
          >
            <AiOutlineDelete />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between  mb-3">
        <Button onClick={_handleAddNewFile}>Add file</Button>

        <div className="flex items-center gap-8">
          <h3>
            {gistData.files.length === 1
              ? `${gistData.files.length} file`
              : gistData.files.length > 1
              ? `${gistData.files.length} files`
              : ''}
          </h3>
          <FileSelector
            gistData={gistData}
            selectedFileId={selectedFileId}
            onChange={(value) => _handleSelectFile(value)}
          />
        </div>
      </div>

      <Tabs defaultValue={tabsValue.CODE.value} value={currentActiveTab.value}>
        <TabsList className="grid grid-cols-2 mb-2 w-[214px]">
          <TabsTrigger
            onClick={() => handleTabChange(tabsValue.MARKDOWN)}
            value={tabsValue.MARKDOWN.value}
          >
            Markdown
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabChange(tabsValue.CODE)}
            value={tabsValue.CODE.value}
          >
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContentWrapper
          visible={currentActiveTab.key === tabsValue.MARKDOWN.key}
          mount={currentActiveTab.key === tabsValue.MARKDOWN.key}
          value={tabsValue.MARKDOWN.value}
          key={remountKey}
        >
          <Tiptap
            content={
              gistData.files.find((file) => file.id === selectedFileId)
                ?.content || ''
            }
            onChange={(value: string) => _handleFileContentChangeMD(value)}
          />
        </TabsContentWrapper>

        <TabsContentWrapper
          visible={currentActiveTab.key === tabsValue.CODE.key}
          mount
          value={tabsValue.CODE.value}
        >
          <CreateCodeContainer
            value={
              gistData.files.find((file) => file.id === selectedFileId)
                ?.content || ''
            }
            handleOnChange={(value: string | undefined) =>
              _handleFileContentChange(value)
            }
          />
        </TabsContentWrapper>
      </Tabs>
      <div className="flex items-center justify-end pl-2">
        <Button disabled={isPosting} onClick={_handleSaveFiles}>
          {isPosting ? 'Saving' : 'Save'}
          {isPosting && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}

export default CodeAndMarkdownWrapper;