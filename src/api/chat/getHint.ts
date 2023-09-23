import { useQuery } from '@tanstack/react-query';
import { axios } from '../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../lib/react-query';
import { IAnswer } from './types';
import { CHAT_API_URL, HINT_API_URL } from './urlKeys';
import { QUERY_KEY_CHAT, QUERY_KEY_HINT } from './queryKeys';

export type GetHintResponse = {
  score: number;
  answer: string;
}[];

export const getHint = ({ query }: { query: string }): Promise<GetHintResponse> => {
  return axios.post(`${HINT_API_URL}`, {
    query
  });
};

type QueryFnType = typeof getHint;

type UseGetHintOptions = {
  query: string;
  config?: QueryConfig<QueryFnType>;
};

export const useHint = ({ query, config }: UseGetHintOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: [QUERY_KEY_HINT, query],
    queryFn: async () => {
      return await getHint({ query });
    }
  });
};
