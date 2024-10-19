import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { CustomSession } from '../auth';
import axiosInstance from '../axios';
import { User } from '../types/gist';

// 定义一个异步函数，用于获取Github用户信息
const getGithubProfile = async (
  // 用户名
  username: string | undefined,
  // 访问令牌
  accessToken: string
) => {
  // 定义一个变量，用于存储用户数据
  let userData: User;

  // 如果有访问令牌
  if (accessToken) {
    // 使用访问令牌获取用户信息
    const response = await axiosInstance.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // 将用户数据存储到变量中
    userData = response.data;
  } else {
    // 如果没有访问令牌
    try {
      // 使用用户名获取用户信息
      const response = await axiosInstance.get(
        `https://api.github.com/users/${username}`
      );

      // 将用户数据存储到变量中
      userData = response.data;
    } catch (error) {
      // 如果获取用户信息失败，则使用本地API获取用户信息
      const response = await axiosInstance.get(
        `${window.location.origin}/api/profile?username=${username}`
      );

      // 将用户数据存储到变量中
      userData = response.data;
    }
  }

  // 返回用户数据
  return userData as User;
};

export const useGithubProfile = (username: string | undefined) => {
  const { data: session } = useSession();

  return useQuery({
    // 定义了查询的唯一标识，确保不同的 username 对应不同的查询缓存。
    queryKey: ['githubProfile', username],
    queryFn: () =>
      getGithubProfile(username, (session as CustomSession)?.accessToken),
    // 控制查询是否启用。只有当 username 存在且不为 undefined 或 null 时，查询才会被触发。
    enabled: !!username,
  });
};
