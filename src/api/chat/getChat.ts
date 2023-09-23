import { useQuery } from '@tanstack/react-query';
import { axios } from '../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../lib/react-query';
import { IAnswer } from './types';
import { CHAT_API_URL } from './urlKeys';
import { QUERY_KEY_CHAT } from './queryKeys';

export type GetChatResponse = {
  messages: {
    data: IAnswer[] | string;
    reply: boolean;
  }[];
};

export const getChat = ({ token }: { token: string }): Promise<GetChatResponse> => {
  return axios.get(`${CHAT_API_URL}/${token}`);
};

type QueryFnType = typeof getChat;

type UseGetChatOptions = {
  token: string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetChat = ({ token, config }: UseGetChatOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [QUERY_KEY_CHAT, token],
    queryFn: async () => {
      return await getChat({ token });
    }
  });
};
