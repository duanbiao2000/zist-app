import { useQueryClient } from '@tanstack/react-query';

import { Files } from '../types/gist';

import { getGistFile } from './useGists';

const useGetAllFilesOfGist = () => {
  const queryClient = useQueryClient();

  // 定义一个异步函数，用于获取文件数据
  const getFilesData = async (files: Files) => {
    // 使用Promise.all()方法，将所有文件的数据请求并行执行
    const data = await Promise.all(
      // 遍历文件对象，获取文件名
      Object.keys(files).map(async (filename) => {
        let fileData;
        // 如果queryClient中已经存在该文件的数据，则直接获取
        if (queryClient.getQueryData(['gistFile', files[filename].raw_url])) {
          fileData = queryClient.getQueryData([
            'gistFile',
            files[filename].raw_url,
          ]);
          // 返回文件名和文件数据
          return {
            filename,
            fileContent: fileData,
          };
        }
        // 如果queryClient中不存在该文件的数据，则进行请求
        fileData = await queryClient.fetchQuery({
          // 设置查询键
          queryKey: ['gistFile', files[filename].raw_url],
          // 设置查询函数
          queryFn: () => getGistFile(files[filename].raw_url),
        });
        // 返回文件名和文件数据
        return {
          filename,
          fileContent: fileData,
        };
      })
    );
    // 返回所有文件的数据
    return data;
  };

  return {
    getFilesData,
  };
};

export default useGetAllFilesOfGist;
