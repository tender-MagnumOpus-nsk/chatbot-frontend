import { useSocket } from '../socket';
import { WS_URL } from '../../../config';
import { useEffect, useState } from 'react';

export interface UseChatProps {
  token: string | null;
  initialMessages?: IMessage[];
}

export enum MessageType {
  me = 'me',
  them = 'them'
}

export interface IAnswer {
  answer: string;
  score: number;
}

export type IMessage =
  | {
      type: MessageType.me;
      text: string;
    }
  | {
      type: MessageType.them;
      text?: string;
      data?: IAnswer[];
      hints?: string[];
    };

export type ChatResponse = Omit<IMessage, 'type'>;

export const useChat = (props: UseChatProps) => {
  const { token, initialMessages = [] } = props;

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (initialMessages) {
      setTimeout(() => {
        setMessages(initialMessages);
      }, 500);
    }
  }, []);

  const { sendMessage: sendSocketMessage } = useSocket({
    url: token ? WS_URL + '/messages/' + token : '',
    enabled: !!token,
    onMessage: (data: ChatResponse) => {
      console.log(data);
      const message = { ...data, type: MessageType.them } as IMessage;
      setMessages((messages) => [...messages, message]);
    },
    onSendMessage: (text: string) => {
      const message = { text, type: MessageType.me } as IMessage;
      setMessages((messages) => [...messages, message]);
    }
  });

  const sendMessage = (message: string) => sendSocketMessage({ payload: message });

  return {
    messages,
    sendMessage
  };
};
