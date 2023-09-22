import { TOKEN_API_URL } from './urlKeys';
import { MutationConfig, queryClient } from '../../lib/react-query';
import { useMutation } from '@tanstack/react-query';
import { axios } from '../../lib/axios';

export type CreateTokenResponse = {
  id: string;
  created: string;
};

export const createToken = (data: {}): Promise<CreateTokenResponse> => {
  return axios.post(TOKEN_API_URL);
};

type UseCreateTokenOptions = {
  config?: MutationConfig<typeof createToken>;
};

export const useCreateToken = ({ config }: UseCreateTokenOptions = {}) => {
  return useMutation({
    // onMutate: async () => {
    //   // await queryClient.cancelQueries([QUERY_KEY_DECKS]);
    // },
    ...config,
    mutationFn: createToken
  });
};
