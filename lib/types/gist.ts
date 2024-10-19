// 导出一个名为Gist的类型
export type Gist = {
  // Gist的URL
  url: string;
  // Gist的分支URL
  forks_url: string;
  // Gist的提交URL
  commits_url: string;
  // Gist的ID
  id: string;
  // Gist的节点ID
  node_id: string;
  // Gist的git拉取URL
  git_pull_url: string;
  // Gist的git推送URL
  git_push_url: string;
  // Gist的HTML URL
  html_url: string;
  // Gist的文件
  files: Files;
  // Gist是否为公开
  public: boolean;
  // Gist的创建时间
  created_at: string;
  // Gist的更新时间
  updated_at: string;
  // Gist的描述
  description: string;
  // Gist的评论数
  comments: number;
  // Gist的用户
  user: null;
  // Gist的评论URL
  comments_url: string;
  // Gist的所有者
  owner: User;
  // Gist的分支
  forks: any[]; // 提供了一个空数组，所以暂时使用any[]
  // Gist的历史记录
  history: History[];
  // Gist是否被截断
  truncated: boolean;
};

export type Files = {
  [filename: string]: GistFileType;
};

export type GistFileType = {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
};

// 定义一个类型CreateFiles，它是一个对象，对象的键是字符串类型，值是一个对象，该对象包含三个属性：content（字符串类型），language（字符串类型），filename（字符串类型）
export type CreateFiles = {
  [filename: string]: {
    content: string;
    language: string;
    filename: string;
  };
};

export type User = {
  name: string;
  bio: string;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  followers: number;
  public_gists: number;
};

// 定义一个History类型，包含user、version、committed_at、change_status和url属性
type History = {
  user: User; // 用户
  version: string; // 版本号
  committed_at: string; // 提交时间
  change_status: {
    total: number; // 总变化数
    additions: number; // 增加数
    deletions: number; // 删除数
  };
  url: string; // 链接
};

export type File = {
  id: string;
  filename: string;
  content: string;
  type: string;
  language: string;
};

// 导出一个名为GistData的类型，该类型包含id、description、public和files四个属性
export type GistData = {
  id: string; // Gist的唯一标识符
  description: string; // Gist的描述
  public: boolean; // Gist是否为公开的
  files: File[]; // Gist包含的文件列表
};

type ReturnValueFilesType = {
  [filename: string]: {
    content: string;
    language: string;
    filename: string;
    type: string;
    size: number;
    truncated: boolean;
    raw_url: string;
  };
};

// 导出一个类型，名为SingleGistResponseData
export type SingleGistResponseData = {
  // 评论数量
  comments: number;
  // 评论URL
  comments_url: string;
  // 提交URL
  commits_url: string;
  // 创建时间
  created_at: string;
  // 描述
  description: string;
  // 文件
  // 定义一个名为files的变量，类型为ReturnValueFilesType
  files: ReturnValueFilesType;
  // 分支
  forks: any[];
  // 分支URL
  forks_url: string;
  // Git拉取URL
  git_pull_url: string;
  // Git推送URL
  git_push_url: string;
  // 历史
  history: any[];
  // HTML URL
  html_url: string;
  // ID
  id: string;
  // 所有者
  owner: User;
  // 是否公开
  public: boolean;
  // 是否截断
  truncated: boolean;
  // 更新时间
  updated_at: string;
  // URL
  url: string;
  // 用户
  user: any;
};
