import s from './ChatPage.module.scss';
import { ReactFCC } from '../../utils/ReactFCC';
import { Header } from './components';
import clsx from 'clsx';
import { ChatInput } from './components/ChatInput';
import { Message, MessageType as MessageComponentType, MessageVariant } from '../../components/Message';
import { MessageContainer } from '../../components/MessageContainer';
import { useEffect, useRef, useState } from 'react';
import { Container } from '../../components/Container';
import { useUrlParam } from '../../hooks/useUrlParam';
import { CHAT_PAGE_PARAM } from '../../app/routes';
import { MessageType, useChat } from './hooks';

const normalizeText = (rawText: string) => {
  const text = rawText.replaceAll(/(\n ?)/gm, '<br />').replaceAll(/(<br \/>[  ]?){2,}/gm, '<br /><br />');
  return text;
};

export const ChatPage: ReactFCC = () => {
  const token = useUrlParam(CHAT_PAGE_PARAM);

  const [value, setValue] = useState('');

  const { messages, sendMessage } = useChat({
    token
  });

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const messageEl = document.querySelector<HTMLDivElement>('.message:last-child');
    if (messageEl) {
      window.scrollTo(0, messageEl.offsetTop - 88);
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = () => {
    const normalizedValue = value.trim();

    if (normalizedValue === '') {
      return;
    }

    sendMessage(normalizedValue);
    setValue('');
  };

  return (
    <div className={s.ChatPage}>
      <div className={s.ChatPage__headerOuter}>
        <Header className={clsx(s.ChatPage__container, s.ChatPage__header)} />
      </div>

      <div className={s.ChatPage__content}>
        <div className={s.ChatPage__contentInner}>
          {messages.map((message, index) => (
            <MessageContainer
              className={clsx('message', {
                [s.ChatPage__messageContainer_right]: message.type === MessageType.me,
                [s.ChatPage__messageContainer_left]: message.type === MessageType.them
              })}
              key={index}>
              <Message
                className={s.ChatPage__message}
                variant={message.type === MessageType.me ? MessageVariant.primary : MessageVariant.secondary}
                type={message.type === MessageType.me ? MessageComponentType.right : MessageComponentType.left}>
                {message.type === MessageType.me ? message.text : normalizeText(message.data[0]?.answer)}
              </Message>
            </MessageContainer>
          ))}

          {/*<MessageContainer className={clsx(s.ChatPage__messageContainer_right)}>*/}
          {/*  <Message className={s.ChatPage__message} variant={MessageVariant.primary} type={MessageType.right}>*/}
          {/*    Страница контракта организации*/}
          {/*  </Message>*/}
          {/*</MessageContainer>*/}

          {/*<MessageContainer className={clsx(s.ChatPage__messageContainer_right)}>*/}
          {/*  <Message className={s.ChatPage__message} variant={MessageVariant.primary} type={MessageType.right}>*/}
          {/*    Страница контракта организации*/}
          {/*  </Message>*/}
          {/*</MessageContainer>*/}

          {/*<MessageContainer className={clsx(s.ChatPage__messageContainer_left)}>*/}
          {/*  <Message className={s.ChatPage__message} variant={MessageVariant.secondary} type={MessageType.left}>*/}
          {/*    {text.replaceAll('\\n', '<br />').replaceAll('\\"', '"')}*/}
          {/*  </Message>*/}
          {/*</MessageContainer>*/}

          {/*<MessageContainer className={clsx(s.ChatPage__messageContainer_left)}>*/}
          {/*  <Message className={s.ChatPage__message} variant={MessageVariant.secondary} type={MessageType.left}>*/}
          {/*    hello world*/}
          {/*  </Message>*/}
          {/*</MessageContainer>*/}

          {/*<MessageContainer className={clsx(s.ChatPage__messageContainer_right)}>*/}
          {/*  <Message className={s.ChatPage__message} variant={MessageVariant.primary} type={MessageType.right}>*/}
          {/*    Страница контракта организации*/}
          {/*  </Message>*/}
          {/*</MessageContainer>*/}
        </div>
      </div>

      <div className={s.ChatPage__formOuter}>
        <Container>
          <ChatInput
            value={value}
            setValue={setValue}
            onSubmit={onSubmit}
            inputRef={inputRef}
            buttonDisabled={value === ''}
          />
        </Container>
      </div>
    </div>
  );
};
