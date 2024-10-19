// 导入usePatchGist函数
import { usePatchGist } from './useGists';
// 导入getZistConfig和updateDescription函数
import { getZistConfig, updateDescription } from './utils';

// 定义useUpdateTags函数
export const useUpdateTags = () => {
  // 解构出usePatchGist函数中的mutateAsync函数和剩余的属性
  const { mutateAsync: updateGist, ...rest } = usePatchGist();

  // 定义updateTags函数，用于更新tags和description
  const updateTags = async ({
    tags,
    description,
    gistId,
  }: {
    tags: string[];
    description: string;
    gistId: string;
  }) => {
    // 获取description中的zistConfig
    let config = getZistConfig(description);

    // 更新config中的tags
    config = {
      ...config,
      tags,
    };

    // 更新description中的zistConfig
    const updatedDescription = updateDescription(description, config);

    // 调用updateGist函数，更新description
    await updateGist({
      description: updatedDescription,
      id: gistId,
    });
  };

  // 返回updateTags函数和剩余的属性
  return {
    updateTags,
    ...rest,
  };
};
