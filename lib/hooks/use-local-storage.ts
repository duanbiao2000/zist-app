import { useEffect, useState } from 'react';

/**
 * 用于从本地存储中存储和检索数据的Hook。
 *
 * 此Hook将组件的状态与本地存储中的数据同步。当组件初始化时，它会首先检查指定键在本地存储中是否有对应的数据，
 * 如果有，它将解析这些数据并将其设置为组件状态的初始值。当组件的状态更新时，它也会同步更新本地存储中的数据。
 *
 * @param key 用于在本地存储中存储数据的键。
 * @param initialValue 当本地存储中没有与键对应的数据时使用的初始状态值。
 * @returns 返回一个数组，包含当前状态值和一个用于更新状态值的函数。
 */
const useLocalStorage = <T>(
  key: string,
  initialValue: T
  /**
   * 忽略ESLint规则的特定警告
   */
  // eslint-disable-next-line no-unused-vars
): [T, (value: T) => void] => {
  // 使用给定的初始值初始化状态
  const [storedValue, setStoredValue] = useState(initialValue);

  // 当指定的键变化时，从本地存储中读取对应的数据并更新状态
  useEffect(() => {
    // 从localStorage中获取数据
    const item = window.localStorage.getItem(key);
    if (item) {
      // 如果存在存储的数据，解析它并更新状态
      setStoredValue(JSON.parse(item));
    }
  }, [key]);

  // 定义一个函数来更新状态并保存到本地存储
  const setValue = (value: T) => {
    // 更新状态
    setStoredValue(value);
    // 将数据保存到localStorage
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  // 返回当前状态值和用于更新状态值的函数
  return [storedValue, setValue];
};

export default useLocalStorage;
