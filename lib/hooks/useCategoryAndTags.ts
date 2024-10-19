import { usePatchGist } from './useGists';
import { getZistConfig, updateDescription } from './utils';

export const useCategoryAndTags = () => {
  // 从usePatchGist钩子中解构出mutateAsync函数，重命名为updateGist，用于异步更新Gist信息
  // 并将其他返回值解构赋值给rest变量
  // 解构赋值，将usePatchGist()函数返回的对象中的mutateAsync属性赋值给updateGist，其余属性赋值给rest
  const { mutateAsync: updateGist, ...rest } = usePatchGist();

  /**
   * 异步更新分类和标签信息
   *
   * 该函数用于根据提供的描述、分类和标签信息更新指定的gist内容
   * 它首先从描述中提取配置信息，然后根据提供的分类和标签更新配置，
   * 最后将更新后的描述内容保存到gist中
   *
   * @param {string} category - 可选参数，用于更新gist的分类
   * @param {string[]} tags - 可选参数，用于更新gist的标签
   * @param {string} description - 必填参数，gist的描述内容，用于提取配置信息并更新
   * @param {string} gistId - 必填参数，gist的唯一标识符，用于定位和更新gist
   */
  const updateCategoryAndTags = async ({
    category,
    tags,
    description,
    gistId,
  }: {
    category?: string;
    tags?: string[];
    description: string;
    gistId: string;
  }) => {
    // 从描述中提取Zist配置
    let config = getZistConfig(description);

    // 更新配置，包含新的分类和标签信息，如果提供了的话
    // 合并配置对象，根据类别和标签的可用性添加它们
    config = {
      ...config, // 保留现有的配置属性
      ...(category && { category }), // 如果category有值，则添加category属性
      ...(tags && { tags }), // 如果tags有值，则添加tags属性
    };

    // 根据更新后的配置信息，更新描述内容
    const updatedDescription = updateDescription(description, config);

    // 更新gist内容，包括描述和ID
    await updateGist({
      description: updatedDescription,
      id: gistId,
    });
  };
  return {
    updateCategoryAndTags,
    ...rest,
  };
};
