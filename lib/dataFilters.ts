import { extensionToLanguage } from './constants/language';
import { getDescription, getZistConfig } from './hooks/utils';
import { Gist } from './types/gist';
// 从 './types/zist' 文件中导入 Filters, SortOrder, Sorts 这三个类型
import { Filters, SortOrder, Sorts } from './types/zist';

// 导出一个函数，用于获取所有Gist数据
export const getAllZistsData = (
  gists: Gist[] | undefined, // Gist数组或undefined
  filter: Filters, // 过滤器
  sort: Sorts, // 排序方式
  sortOrder: SortOrder // 排序顺序
) => {
  let data: Gist[] = [...(gists || [])]; // 将gists数组复制给data数组

  // filters
  // 过滤掉没有文件的Gist
  data = data.filter((gist: Gist) => {
    if (Object.keys(gist.files).length === 0) {
      return false;
    }
    return true;
  });

  // category
  if (filter?.category) {
    data = data.filter((gist: Gist) => {
      const { category } = getZistConfig(gist.description); // 获取Gist的配置信息

      if (category === filter.category) {
        return true;
      }
      return false;
    });
  }

  // tags
  if (filter?.tags && filter?.tags.length > 0) {
    data = data.filter((gist: Gist) => {
      const { tags } = getZistConfig(gist.description); // 获取Gist的配置信息

      if (tags) {
        const hasTag = tags.some((tag: string) => filter.tags?.includes(tag)); // 判断Gist的标签是否包含在过滤器的标签中

        if (hasTag) {
          return true;
        }
      }
      return false;
    });
  }

  // language
  if (filter?.language) {
    data = data.filter((gist: Gist) => {
      let hasLanguage = false;

      Object.keys(gist.files).forEach((file: string) => {
        const extension = file?.split('.').pop(); // 获取文件的扩展名

        const language = extensionToLanguage[extension as string]; // 根据扩展名获取语言

        if (language === filter.language) {
          hasLanguage = true;
        }
      });

      if (hasLanguage) {
        return true;
      }
      return false;
    });
  }

  // private
  if (filter?.private) {
    data = data.filter((gist: Gist) => {
      if (gist.public === !filter.private) {
        return true;
      }
      return false;
    });
  }

  // search
  if (filter?.search) {
    data = data.filter((gist: Gist) => {
      const description = getDescription(gist.description); // 获取Gist的描述
      const files = Object.keys(gist.files).join(' '); // 获取Gist的文件名

      if (
        description
          ?.toLowerCase()
          .includes((filter?.search as string).toLowerCase()) ||
        files.toLowerCase().includes((filter?.search as string).toLowerCase())
      ) {
        return true;
      }
      return false;
    });
  }

  // sorts
  if (sort === 'updated') {
    if (sortOrder === 'asc') {
      data = data.sort((a: Gist, b: Gist) => {
        const aDate = new Date(a.updated_at);
        const bDate = new Date(b.updated_at);

        return aDate.getTime() - bDate.getTime();
      });
    } else {
      data = data.sort((a: Gist, b: Gist) => {
        const aDate = new Date(a.updated_at);
        const bDate = new Date(b.updated_at);

        return bDate.getTime() - aDate.getTime();
      });
    }
  }

  if (sort === 'created') {
    if (sortOrder === 'asc') {
      data = data.sort((a: Gist, b: Gist) => {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);

        return aDate.getTime() - bDate.getTime();
      });
    } else {
      data = data.sort((a: Gist, b: Gist) => {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);

        return bDate.getTime() - aDate.getTime();
      });
    }
  }

  return data;
};

export const getAllCategories = (gists: Gist[] | undefined) => {
  let categories: string[] = [];

  gists?.forEach((gist: Gist) => {
    const { category } = getZistConfig(gist.description);

    if (category) {
      categories.push(category);
    }
  });

  categories = Array.from(new Set(categories));

  return categories;
};

export const getAllTags = (gists: Gist[] | undefined) => {
  let tagsData: string[] = [];

  gists?.forEach((gist: Gist) => {
    const { tags } = getZistConfig(gist.description);

    if (tags) {
      tagsData = [...tagsData, ...tags];
    }
  });

  tagsData = Array.from(new Set(tagsData));

  return tagsData;
};

export const getAllLanguages = (gists: Gist[] | undefined) => {
  let languages: string[] = [];

  gists?.forEach((gist: Gist) => {
    Object.keys(gist.files).forEach((file: string) => {
      const extension = file?.split('.').pop();

      const language = extensionToLanguage[extension as string];

      if (language) {
        languages.push(language);
      }
    });
  });

  languages = Array.from(new Set(languages));

  return languages;
};
