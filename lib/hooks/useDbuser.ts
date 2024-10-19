// 导入React Query的useQuery钩子，用于处理数据获取
import { useQuery } from '@tanstack/react-query';
// 导入Next Authentication的useSession钩子，用于获取当前会话信息
import { useSession } from 'next-auth/react';

// 导入自定义的Session类型，可能用于特定的会话数据结构
import { CustomSession } from '../auth';
// 导入axios实例，用于HTTP请求
import axiosInstance from '../axios';

/**
 * 异步获取数据库用户信息
 *
 * 本函数通过发送HTTP GET请求到服务器，以获取用户的自动标签计数和相关信息
 * 使用axios实例进行请求，以确保请求可以被配置或拦截，提高代码的可维护性和可测试性
 *
 * @returns 返回一个包含用户自动标签计数、用户名、最大允许标签数和更新时间的对象
 */
const getDbUser = async () => {
  // 使用axios实例向服务器发送GET请求，获取自动标签计数信息
  const response = await axiosInstance.get(
    `${window.location.origin}/api/autotagcount`
  );

  // 返回服务器响应的数据，并将其断言为特定的类型格式
  // 这里断言确保了返回的数据符合预期的结构，使得类型安全得到保障
  return response.data as {
    autotagcount: number;
    username: string;
    maxallowed: number;
    updatedAt: string;
  };
};

/**
 * 自定义钩子，用于获取数据库中的用户信息
 *
 * 此钩子在以下情况下启用：当用户有有效的会话时
 * 它根据会话中的用户名来查询数据库，以获取相应的用户信息
 *
 * @returns 返回一个查询对象，包含用户信息以及状态
 */
export const useGetDbUser = () => {
  // 使用useSession钩子来获取当前用户的会话信息
  const { data: session } = useSession();

  // 使用useQuery钩子来查询数据库中的用户信息
  // queryKey用于标识查询的唯一键，这里使用会话中的用户名（如果存在）
  // queryFn是执行实际查询的函数
  // enabled控制查询是否启用，只有当session存在时才启用
  return useQuery({
    queryKey: ['dbUser', (session as CustomSession)?.user?.username],
    queryFn: getDbUser,
    enabled: !!session,
  });
};
