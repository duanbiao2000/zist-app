// 导入React Query库中的各种函数和钩子
import {
  Updater,
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
// 导入Next.js中的useSession钩子，用于获取当前用户的会话信息
import { useSession } from 'next-auth/react';
// 导入react-hot-toast库中的toast函数，用于显示提示信息
import { toast } from 'react-hot-toast';
// 导入Next.js中的useRouter钩子，用于导航到其他页面
import { useRouter } from 'next/navigation';

// 导入自定义的Profile和Session类型
import { CustomProfile, CustomSession } from '../auth';
// 导入Gist和GistFileType类型，以及CreateFiles和SingleGistResponseData类型
import {
  Gist,
  GistFileType,
  CreateFiles,
  SingleGistResponseData,
} from '../types/gist';
// 导入axios库，用于发送HTTP请求
import axios from '../axios';

// ---------------------------------- GET all authenticated gists ----------------------------------

/**
 * 获取认证用户的所有Gist
 *
 * 本函数通过GitHub API获取当前认证用户的所有Gist它使用提供的访问令牌进行授权，
 * 并允许分页获取Gist列表
 *
 * @param accessToken - 访问GitHub API所需的认证令牌
 * @param page - 获取Gist的页码
 * @returns 返回一个Promise，解析为Gist类型的数组
 */
export const getAllGistsOfAuthenticatedUser = async (
  accessToken: string,
  page: number
) => {
  // 发起GET请求到GitHub API获取用户的Gist列表
  // 使用传入的访问令牌和分页参数
  const response = await axios.get('https://api.github.com/gists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
    params: {
      page,
    },
  });

  // 将响应的数据解析为Gist类型数组并返回
  return response.data as Gist[];
};

/**
 * 自定义钩子，用于获取认证用户的所有Gist
 * 该钩子使用了SessionProvider的useSession钩子来获取用户会话信息，
 * 并使用useInfiniteQuery钩子来处理分页查询
 *
 * @returns 返回一个useInfiniteQuery的查询对象，包含getAllGistsOfAuthenticatedUser函数的查询结果
 */
export const useGetAllGistsOfAuthenticatedUser = () => {
  // 使用useSession钩子获取当前会话数据
  const { data: session } = useSession();

  // 使用useInfiniteQuery钩子进行无限滚动查询
  return useInfiniteQuery({
    // 查询键，包含Gist名称和用户ID（如果用户已认证）
    queryKey: ['gists', (session?.user as CustomProfile)?.id],
    // 查询函数，接受页码参数，返回Gist数据
    queryFn: ({ pageParam }) =>
      getAllGistsOfAuthenticatedUser(
        (session as CustomSession)?.accessToken,
        pageParam
      ),
    // 当session存在时启用查询
    enabled: !!session,
    // 初始页码参数
    initialPageParam: 1,
    // 获取下一页码的函数，当当前页数据为空时，不再请求下一页
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    // 获取上一页码的函数，当当前页码为第一页时，不再请求上一页
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    // 在初始数据加载时保留之前的数据，提高用户体验
    placeholderData: keepPreviousData,
  });
};

// ---------------------------------- GET all gists of a user ----------------------------------

/**
 * 异步获取指定用户的全部Gist
 * @param username GitHub用户名
 * @param accessToken 访问令牌，用于授权请求
 * @param page 请求的页码
 * @returns 返回一个包含Gist的数组
 */
const getAllGistsOfUser = async (
  username: string,
  accessToken: string,
  page: number
) => {
  let data: Gist[] = [];

  // 当提供accessToken时，直接通过GitHub API获取Gist信息
  if (accessToken) {
    const response = await axios.get(
      `https://api.github.com/users/${username}/gists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          page,
        },
      }
    );

    data = response.data as Gist[];
  } else {
    try {
      // 当没有提供accessToken时，首先尝试直接通过GitHub API获取Gist信息
      const response = await axios.get(
        `https://api.github.com/users/${username}/gists`,
        {
          headers: {
            // 定义一个常量，用于指定GitHub API的接受内容类型
            // 这里使用application/vnd.github.v3+json是因为我们调用的是GitHub的API
            // 并且需要返回JSON格式的数据
            // 在与GitHub API交互时，此头部告诉服务器客户端希望使用哪个版本的API和数据格式
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            page,
          },
        }
      );

      data = response.data as Gist[];
    } catch {
      // 若上述请求失败，则尝试通过本地API获取Gist信息
      // ${window.location.origin}: 这是一个模板字符串，它包含了当前页面的协议、主机名和端口号（如果有的话）。例如，如果你的应用运行在http://localhost:3000，那么window.location.origin将会是"http://localhost:3000"。
      const response = await axios.get(
        `${window.location.origin}/api/userGists?username=${username}&page=${page}`
      );

      data = response.data as Gist[];
    }
  }

  return data;
};

export const useGetAllGistsOfUser = (username: string) => {
  const { data: session } = useSession();
  return useInfiniteQuery({
    queryKey: ['gists', username],
    queryFn: ({ pageParam }) =>
      getAllGistsOfUser(
        username,
        (session as CustomSession)?.accessToken,
        pageParam
      ),
    enabled: !!username,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    placeholderData: keepPreviousData,
  });
};

// ---------------------------------- GET gist by id ----------------------------------

const getGistById = async (id: string, accessToken: string) => {
  let data: SingleGistResponseData;

  if (accessToken) {
    const response = await axios.get(`https://api.github.com/gists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    data = response.data as SingleGistResponseData;
  } else {
    try {
      const response = await axios.get(`https://api.github.com/gists/${id}`, {
        headers: {
          // 当你向GitHub API发送请求时，通常需要在请求头中包含这个MIME类型，以确保API返回的数据格式是JSON，并且是v3版本的API。
          Accept: 'application/vnd.github.v3+json',
        },
      });

      data = response.data as SingleGistResponseData;
    } catch {
      const response = await axios.get(
        `${window.location.origin}/api/gist?id=${id}`
      );

      data = response.data as SingleGistResponseData;
    }
  }

  return data;
};

export const useGetGistById = (id: string) => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['gist', id],
    queryFn: () => getGistById(id, (session as CustomSession)?.accessToken),
    enabled: !!id,
  });
};

// ---------------------------------- GET gist file ----------------------------------

export const getGistFile = async (raw_url: string | undefined) => {
  if (!raw_url) {
    return;
  }
  const response = await axios.get(raw_url);

  return response.data;
};

export const useGetGistFile = (raw_url: string | undefined) => {
  return useQuery({
    queryKey: ['gistFile', raw_url],
    queryFn: () => getGistFile(raw_url),
    enabled: !!raw_url,
  });
};

// ---------------------------------- PATCH gist ----------------------------------

export type GistUpdatePayload = {
  id: string;
  description?: string;
  files?: GistFileType[];
  public?: boolean;
};

const patchGist = async (accessToken: string, data: GistUpdatePayload) => {
  const response = await axios.patch(
    `https://api.github.com/gists/${data.id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  return response.data;
};

export const usePatchGist = () => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation({
    mutationFn: (data: GistUpdatePayload) =>
      patchGist((session as CustomSession)?.accessToken, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ['gists', (session?.user as CustomProfile)?.id],
      });

      await queryClient.cancelQueries({
        queryKey: ['gist', data.id],
      });

      const previousGists = queryClient.getQueryData([
        'gists',
        (session?.user as CustomProfile)?.id,
      ]) as {
        pages: Gist[][];
      };

      if (!previousGists) {
        return;
      }

      const previousGist = queryClient.getQueryData(['gist', data.id]) as Gist;

      if (!previousGist) {
        return;
      }

      const updatedPages = previousGists.pages.map((page) =>
        page.map((gist) => {
          if (gist.id === data.id) {
            return {
              ...gist,
              ...data,
            } as Gist;
          }
          return gist;
        })
      );

      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        ((old: { pages: Gist[][] }) => {
          return {
            ...old,
            pages: updatedPages,
          };
        }) as Updater<{ pages: Gist[][] } | undefined, { pages: Gist[][] }>
      );

      queryClient.setQueryData(['gist', data.id], ((old: Gist) => {
        return {
          ...old,
          ...data,
        } as Gist;
      }) as Updater<Gist | undefined, Gist | undefined>);

      return { previousGists, previousGist };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        context?.previousGists
      );

      queryClient.setQueryData(
        ['gist', context?.previousGist?.id],
        context?.previousGist
      );
    },
    onSuccess: (data: Gist) => {
      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        ((old: { pages: Gist[][] }) => {
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((gist) => {
                if (gist.id === data.id) {
                  return {
                    ...gist,
                    ...data,
                  } as Gist;
                }
                return gist;
              })
            ),
          };
        }) as Updater<{ pages: Gist[][] } | undefined, { pages: Gist[][] }>
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['gists', (session?.user as CustomProfile)?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['gistFile'],
      });

      router.push('/dashboard');
    },
  });
};

// ---------------------------------- POST gist ----------------------------------

export type GistCreatePayload = {
  description?: string;
  files: CreateFiles;
  public?: boolean;
};

const postGist = async (accessToken: string, data: GistCreatePayload) => {
  const response = await axios.post(`https://api.github.com/gists`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.data as Gist;
};

export const usePostGist = () => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GistCreatePayload) =>
      postGist((session as CustomSession)?.accessToken, data),
    onError: () => {
      toast.error('Failed to create gist');
    },

    onSuccess: (data: Gist) => {
      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        ((old: { pages: Gist[][] }) => {
          return {
            ...old,
            pages: [[data], ...old.pages],
          };
        }) as Updater<{ pages: Gist[][] } | undefined, { pages: Gist[][] }>
      );

      queryClient.invalidateQueries({
        queryKey: ['gists', (session?.user as CustomProfile)?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['gistFile'],
      });

      router.push('/dashboard');
    },
  });
};

// ---------------------------------- DELETE gist ----------------------------------

const deleteGist = async (accessToken: string, id: string) => {
  const response = await axios.delete(`https://api.github.com/gists/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return response.data;
};

export const useDeleteGist = () => {
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteGist((session as CustomSession)?.accessToken, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ['gists', (session?.user as CustomProfile)?.id],
      });

      const previousGists = queryClient.getQueryData([
        'gists',
        (session?.user as CustomProfile)?.id,
      ]) as {
        pages: Gist[][];
      };

      if (!previousGists) {
        return;
      }

      const allGists = previousGists.pages.flat();

      const filteredGists = allGists?.filter((gist) => gist.id !== id);

      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        filteredGists
      );

      return { previousGists };
    },

    onError: (err, _, context) => {
      queryClient.setQueryData(
        ['gists', (session?.user as CustomProfile)?.id],
        context?.previousGists
      );
    },
  });
};
