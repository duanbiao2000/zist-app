// 导入ZistConfig类型
import { ZistConfig } from '../types/zist';

// 解析描述函数
const parseDescription = (description: string) => {
  // 如果描述中不包含<-ZIST-CONFIG->
  if (!description?.includes('<-ZIST-CONFIG->')) {
    // 返回描述文本和空配置
    return {
      descriptionText: description,
      config: {} as ZistConfig,
    };
  }
  // 将描述文本和配置文本分开
  const [descriptionText, configText] = description?.split('<-ZIST-CONFIG->');

  // 将配置文本解析为JSON
  const config = JSON.parse(configText || '{}');

  // 返回描述文本和配置
  return {
    descriptionText,
    config: config as ZistConfig,
  };
};

// 获取描述文本函数
export const getDescription = (description: string) => {
  // 解析描述，返回描述文本
  const { descriptionText } = parseDescription(description);

  return descriptionText;
};

// 获取ZistConfig函数
export const getZistConfig = (description: string) => {
  // 解析描述，返回配置
  const { config } = parseDescription(description);

  return config;
};

// 更新描述函数
export const updateDescription = (description: string, config: ZistConfig) => {
  // 解析描述，返回描述文本
  const { descriptionText } = parseDescription(description);

  // 返回更新后的描述
  return `${descriptionText}<-ZIST-CONFIG->${JSON.stringify(config)}`;
};
