import {
  NextAuthOptions,
  getServerSession,
  type Profile,
  type Session,
} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// 导出一个名为CustomSession的类型，它是一个对象，包含accessToken和user两个属性
export type CustomSession = {
  // accessToken是一个字符串类型，用于存储访问令牌
  accessToken: string;
  // user是一个对象，包含id和username两个属性
  user: {
    // id是一个数字类型，用于存储用户的唯一标识
    id: number;
    username: string;
  };
} & Session; // 合并两个接口，将Session接口中的属性和方法添加到当前接口中

export type CustomProfile = {
  id: number;
  login: string;
} & Profile;
//
// 导出一个NextAuthOptions类型的常量authOptions
export const authOptions: NextAuthOptions = {
  // 设置NextAuth的secret
  secret: process.env.NEXTAUTH_SECRET,

  // 设置提供者
  providers: [
    // 使用GithubProvider
    GithubProvider({
      // 设置Github的clientId
      clientId: process.env.GITHUB_ID as string,
      // 设置Github的clientSecret
      clientSecret: process.env.GITHUB_SECRET as string,
      // 设置Github的授权参数
      authorization: { params: { scope: 'gist' } },
    }),
  ],

  // 将访问令牌推送到会话中
  callbacks: {
    // 在登录后，将OAuth访问令牌和/或用户id持久化到令牌中
    async jwt({ token, account, profile }) {
      // 如果有account，将access_token添加到token中
      if (account) {
        token.accessToken = account.access_token;
      }

      // 如果有profile，将id和login添加到token中
      if (profile) {
        token.id = (profile as CustomProfile).id;
        token.username = (profile as CustomProfile).login;
      }
      return token;
    },
    // 将属性发送到客户端，如来自提供者的访问令牌和用户id
    async session({ session, token }) {
      // 将访问令牌和用户id添加到session中
      (session as CustomSession).accessToken = token.accessToken as string;
      (session as CustomSession).user.id = token.id as number;
      (session as CustomSession).user.username = token.username as string;

      return session as CustomSession;
    },
  },
};

export function getServerSideUserSession() {
  return getServerSession(authOptions) as Promise<CustomSession | null>;
}
