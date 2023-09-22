import { useSocket } from '../socket';
import { WS_URL } from '../../../config';
import { useState } from 'react';

export interface UseChatProps {
  token: string | null;
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
      // [key: string]: any | undefined;
    }
  | {
      type: MessageType.them;
      data: IAnswer[];
    };

export type ChatResponse = Omit<IMessage, 'type'>;

export const useChat = (props: UseChatProps) => {
  const { token } = props;

  const [messages, setMessages] = useState<IMessage[]>([]);

  const { sendMessage: sendSocketMessage } = useSocket({
    url: token ? WS_URL + '/messages/' + token : '',
    enabled: !!token,
    onMessage: (data: ChatResponse) => {
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
