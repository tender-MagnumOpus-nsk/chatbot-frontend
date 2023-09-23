import { useSocket } from '../socket';
import { WS_URL } from '../../../config';
import { useEffect, useRef, useState } from 'react';
import { ChatResponse, IAnswer, IMessage, MessageType } from '../../../api/chat/types';
import { useGetChat } from '../../../api/chat/getChat';

export interface UseChatProps {
  token: string | null;
  initialMessages?: IMessage[];
}

export const useChat = (props: UseChatProps) => {
  const { token, initialMessages = [] } = props;

  const [messages, setMessages] = useState<IMessage[]>([]);

  const { data } = useGetChat({
    token: token || '',
    config: {
      enabled: !!token
    }
  });

  const mountedRef = useRef(false);
  useEffect(() => {
    if (data && !mountedRef.current) {
      setMessages(
        data.messages.map((i) => {
          if (i.reply) {
            return { type: MessageType.them, active: 0, data: i.data as IAnswer[] };
          } else {
            return { type: MessageType.me, text: i.data as string } as IMessage;
          }
        })
      );
      mountedRef.current = true;
    }
  }, [data]);

  // const isMounted = useIsMounted();

  // if (!isMounted()) {
  //   if (initialMessages) {
  //     setTimeout(() => {
  //       setMessages(initialMessages);
  //     }, 500);
  //   }
  // }

  const { sendMessage: sendSocketMessage } = useSocket({
    url: token ? WS_URL + '/messages/' + token : '',
    enabled: !!token,
    onMessage: (data: ChatResponse) => {
      console.log(data);
      const message = { ...data, type: MessageType.them, active: 0 } as IMessage;
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
    sendMessage,
    setMessages
  };
};
