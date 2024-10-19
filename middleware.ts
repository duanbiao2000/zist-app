import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 中间件函数，用于检查用户是否拥有有效的会话令牌
 * 如果没有检测到有效的会话令牌，则重定向用户到首页
 *
 * @param request NextRequest对象，包含有关HTTP请求的信息
 * @returns 返回一个NextResponse对象，如果用户没有有效的会话令牌，则进行重定向
 */
export async function middleware(request: NextRequest) {
  // 尝试从cookie中获取会话令牌，如果不存在，则尝试获取安全会话令牌
  const token =
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token');

  // 如果没有检测到有效的会话令牌，则重定向用户到首页
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// 配置中间件的应用范围
// 仅当URL匹配'/dashboard/:path*'时，才应用此中间件
export const config = {
  matcher: ['/dashboard/:path*'],
};
