// 导入axios库
import axios from 'axios';

// 创建一个axios实例
const axiosInstance = axios.create({});

// 在请求发送之前，拦截请求
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 在请求参数中添加时间戳
    config.params = { ...config.params, timestamp: Date.now() };
    return config;
  },
  function (error) {
    // Do something with request error
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 导出axios实例
export default axiosInstance;
