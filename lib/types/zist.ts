// 导出ZistConfig类型，包含可选的category和tags属性
export type ZistConfig = {
  category?: string;
  tags?: string[];
};

// 导出Filters类型，包含可选的category、tags、search、language、private属性
export type Filters = {
  category?: string;
  tags?: string[];
  search?: string;
  language?: string;
  private?: boolean;
};

// 导出TabsView类型，包含一个key属性和一个value属性的对象
export type TabsView = {
  [key: string]: {
    key: string;
    value: string;
  };
};

// 导出Tab类型，包含一个key属性和一个value属性的对象
export type Tab = {
  key: string;
  value: string;
};

// 导出Sorts类型，包含'updated'和'created'两个值
export type Sorts = 'updated' | 'created';

// 导出SortOrder类型，包含'asc'和'desc'两个值
export type SortOrder = 'asc' | 'desc';
