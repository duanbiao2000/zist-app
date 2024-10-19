import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

interface UsersTable {
  username: string;
  autotagcount: number;
  maxallowed?: number;
  updated_at?: string;
}

interface Database {
  users: UsersTable;
}

// 导出一个名为queryBuilder的常量，它是一个Kysely实例，用于与数据库进行交互
export const queryBuilder = new Kysely<Database>({
  // 设置数据库方言为PlanetScaleDialect
  dialect: new PlanetScaleDialect({
    // 从环境变量中获取数据库URL
    url: process.env.DATABASE_URL,
  }),
});
