import { Route, Routes } from 'react-router-dom';
import { CHAT_PAGE_ROUTE, TOKEN_PAGE_ROUTE } from './routes';
import { ChatPage } from '../../pages/chat';
import { TokenPage } from '../../pages/token';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={TOKEN_PAGE_ROUTE} element={<TokenPage />} />
      <Route path={CHAT_PAGE_ROUTE} element={<ChatPage />} />
    </Routes>
  );
};
