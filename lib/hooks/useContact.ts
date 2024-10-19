import { useMutation } from '@tanstack/react-query';

import axiosInstance from '../axios';

/**
 * 发送消息的异步函数
 * @param {string} message - 要发送的消息
 * @returns {Promise<any>} 返回一个Promise，包含服务器的响应数据
 */
const sendMessage = async (message: string) => {
  // 使用axiosInstance向当前窗口的origin地址加上/api/contact路径发送POST请求
  // 请求体包含一个键值对，键为message，值为传入的message字符串
  const response = await axiosInstance.post(
    `${window.location.origin}/api/contact`,
    {
      message,
    }
  );

  // 返回服务器响应的数据
  return response.data;
};

export const useSendMessage = () => {
  // 使用 useMutation 高阶函数来创建一个 Mutation 对象
  // 它接受一个对象作为参数，该对象包含 mutationFn 属性
  // mutationFn 属性被设置为 sendMessage 函数，这是实际执行 Mutation 操作的函数
  return useMutation({
    mutationFn: sendMessage,
  });
};
