// 导入usePatchGist钩子，用于处理gist的更新
import { usePatchGist } from './useGists';
// 导入工具函数，包括加载Zist配置和更新描述
import { getZistConfig, updateDescription } from './utils';

export const useCreateCategory = () => {
  const { mutateAsync: updateGist, ...rest } = usePatchGist();

  const createCategory = async ({
    category,
    description,
    gistId,
  }: {
    category: string;
    description: string;
    gistId: string;
  }) => {
    let config = getZistConfig(description);

    config = {
      ...config,
      category,
    };

    const updatedDescription = updateDescription(description, config);

    await updateGist({
      description: updatedDescription,
      id: gistId,
    });
  };

  return {
    createCategory,
    ...rest,
  };
};

/**
 * 钩子函数，用于更新代码片段的分类
 * 此函数封装了更新代码片段分类的逻辑，包括更新配置和调用API
 */
export const useUpdateCategory = () => {
  // 使用usePatchGist钩子获取更新代码片段的函数和相关状态
  const { mutateAsync: updateGist, ...rest } = usePatchGist();

  /**
   * 更新代码片段的分类
   * @param {string} category - 新的分类名称
   * @param {string} description - 代码片段的描述，包含配置信息
   * @param {string} gistId - 代码片段的ID
   * @returns {Promise} - 返回更新操作的Promise对象
   */
  const updateCategory = async ({
    category,
    description,
    gistId,
  }: {
    category: string;
    description: string;
    gistId: string;
  }) => {
    // 从描述中获取当前的配置信息
    let config = getZistConfig(description);

    // 更新分类信息
    config = {
      ...config,
      category,
    };

    // 根据新的配置信息更新描述
    const updatedDescription = updateDescription(description, config);

    // 调用updateGist函数更新代码片段的描述和分类
    return await updateGist({
      description: updatedDescription,
      id: gistId,
    });
  };

  // 返回更新分类的函数和usePatchGist钩子的其他状态
  return {
    updateCategory,
    ...rest,
  };
};

/**
 * 定义一个删除分类的自定义钩子
 * 该钩子主要用于从Gist中删除分类信息
 */
export const useDeleteCategory = () => {
  // 使用usePatchGist钩子，获得其mutateAsync函数，并解构其他属性
  const { mutateAsync: updateGist, ...rest } = usePatchGist();

  /**
   * 删除Gist中的分类
   *
   * @param {Object} params - 包含description和gistId的对象
   * @param {string} params.description - Gist的描述，其中包含配置信息
   * @param {string} params.gistId - Gist的ID，用于标识哪个Gist需要更新
   * @returns {Promise} 返回一个Promise，表示异步操作的结果
   */
  const deleteCategory = async ({
    description,
    gistId,
  }: {
    category: string;
    description: string;
    gistId: string;
  }) => {
    // 从description中获取Zist配置
    let config = getZistConfig(description);

    // 从配置中删除category属性
    delete config.category;

    // 更新description
    const updatedDescription = updateDescription(description, config);

    // 调用updateGist函数，更新Gist的描述
    return await updateGist({
      description: updatedDescription,
      id: gistId,
    });
  };

  // 返回deleteCategory函数和其他属性
  return {
    deleteCategory,
    ...rest,
  };
};
