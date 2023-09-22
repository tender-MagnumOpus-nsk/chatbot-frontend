import {
  CHAT_PAGE_PARAM,
  CHAT_PAGE_ROUTE,
  RESPONSE_PAGE_PARAM,
  RESPONSE_PAGE_ROUTE,
  TEXT_PAGE_PARAM,
  TEXT_PAGE_ROUTE
} from './routes';

export class PathBuilder {
  static getChatPath = (id: string) => CHAT_PAGE_ROUTE.replace(`:${CHAT_PAGE_PARAM}`, String(id));
}
