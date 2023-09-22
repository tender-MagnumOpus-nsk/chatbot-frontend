import { useCreateToken } from '../../api/chat';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PathBuilder } from '../../app/routes';

export const TokenPage = () => {
  const { mutateAsync: createToken } = useCreateToken();
  const navigate = useNavigate();

  useEffect(() => {
    createToken({}).then((response) => {
      if (response.id) {
        navigate(PathBuilder.getChatPath(response.id), { replace: true });
      }
    });
  }, []);

  return null;
};
