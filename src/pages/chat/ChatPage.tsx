import { MouseEvent } from 'react';
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
import { Button, ButtonSize, ButtonVariant } from '../../components/Button';

const normalizeText = (rawText: string) => {
  const text = rawText.replaceAll(/(\n ?)/gm, '<br />').replaceAll(/(<br \/>[  ]?){2,}/gm, '<br /><br />');
  return text;
};

export const ChatPage: ReactFCC = () => {
  const token = useUrlParam(CHAT_PAGE_PARAM);

  const [value, setValue] = useState('');

  const { messages, sendMessage } = useChat({
    token,
    initialMessages: [
      {
        type: MessageType.them,
        text: `Здравствуйте! <br /> Сотрудники службы информационной поддержки Портала поставщиков ответят на вопросы о работе системы, окажут помощь в получении и поиске информации на портале.`
      },
      {
        type: MessageType.them,
        text: `Выберите, пожалуйста, тему обращения:`,
        hints: [
          'Страница контракта организации',
          'Регистрация на портале',
          'Участие в котировочной сессии',
          'Подобрать товары',
          'Добавить товары в Каталог'
        ]
      }
    ]
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

  const onSubmit = (val = value) => {
    const normalizedValue = val.trim();

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
              type={message.type === MessageType.me ? MessageComponentType.right : MessageComponentType.left}
              key={index}>
              <Message
                className={s.ChatPage__message}
                variant={message.type === MessageType.me ? MessageVariant.primary : MessageVariant.secondary}
                type={message.type === MessageType.me ? MessageComponentType.right : MessageComponentType.left}>
                {message.type === MessageType.me
                  ? message.text
                  : message.text ?? normalizeText(message.data?.[0]?.answer || '')}
              </Message>

              {message.type === MessageType.them && message.hints && message.hints.length !== 0 && (
                <div className={s.ChatPage__hintContainer}>
                  {message.hints.map((hint, index) => (
                    <Button
                      variant={ButtonVariant.tertiary}
                      size={ButtonSize.small_x}
                      key={index}
                      onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        onSubmit(hint);
                      }}>
                      {hint}
                    </Button>
                  ))}
                </div>
              )}
            </MessageContainer>
          ))}
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
            inputHints={['Страница контракта организации']}
            onClickHint={(hint) => onSubmit(hint)}
          />
        </Container>
      </div>
    </div>
  );
};
