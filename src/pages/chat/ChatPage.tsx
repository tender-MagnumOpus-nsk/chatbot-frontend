import { MouseEvent, useEffect, useRef, useState } from 'react';
import s from './ChatPage.module.scss';
import { ReactFCC } from '../../utils/ReactFCC';
import { Header } from './components';
import clsx from 'clsx';
import { ChatInput } from './components/ChatInput';
import { Message, MessagePlacement, MessageVariant } from '../../components/Message';
import { MessageContainer } from '../../components/MessageContainer';
import { Container } from '../../components/Container';
import { useUrlParam } from '../../hooks/useUrlParam';
import { CHAT_PAGE_PARAM } from '../../app/routes';
import { useChat } from './hooks';
import { Button, ButtonSize, ButtonVariant } from '../../components/Button';
import { useSingleTimeout } from '../../hooks/useSingleTimeout';
import { MessageType } from '../../api/chat/types';
import { usePrevious } from '../../hooks/usePrevious';

const normalizeText = (rawText: string) => {
  return rawText
    .trim()
    .replaceAll(/(\n ?)/gm, '<br />')
    .replaceAll(/(<br \/>[  ]?){2,}/gm, '<br /><br />')
    .replaceAll(/(  ?){2,}/gm, ' ')
    .replaceAll('&quot;', '"');
};

export const ChatPage: ReactFCC = () => {
  const token = useUrlParam(CHAT_PAGE_PARAM);

  const [value, setValue] = useState('');

  const { messages, sendMessage, setMessages } = useChat({
    token,
    initialMessages: [
      {
        type: MessageType.them,
        text: `Здравствуйте! <br /> Сотрудники службы информационной поддержки Портала поставщиков ответят на вопросы о работе системы, окажут помощь в получении и поиске информации на портале.`,
        active: 0
      },
      {
        type: MessageType.them,
        text: `Выберите, пожалуйста, тему обращения:`,
        active: 0,
        hints: [
          'Как определяется победитель тендера',
          'Как создать оферту',
          'Как найти товар',
          'Сколько по времени идет котировочная сессия',
          'Срок продолжительности котировочной сессии',
          'Как вернуть оферту из архива?',
          'Требования к рабочему месту пользователя уполномоченного органа'
        ]
      }
    ]
  });

  const timeout = useSingleTimeout();

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messageEl = document.querySelector<HTMLDivElement>('.message:last-child');
    if (messageEl) {
      window.scrollTo(0, messageEl.offsetTop - 88);
    }

    if (!textRef.current) {
      return;
    }

    const resetTip = () => {
      if (tipRef.current) {
        tipRef.current.style.opacity = `0`;

        timeout.set(() => {
          if (tipRef.current) {
            tipRef.current.style.top = `0px`;
            tipRef.current.style.left = `0px`;
            tipRef.current.style.visibility = `hidden`;
            tipRef.current.innerText = ``;
          }
        }, 500);
      }
    };

    textRef.current.querySelectorAll('.hintText').forEach((item) => {
      item.addEventListener('mouseover', (e: any) => {
        const value = Number(item.getAttribute('data-value'));

        if (tipRef.current && value > 0.1) {
          timeout.clear();
          tipRef.current.style.top = `${e.clientY}px`;
          tipRef.current.style.left = `${e.clientX + 8}px`;
          tipRef.current.style.visibility = `visible`;
          tipRef.current.style.opacity = `1`;
          tipRef.current.innerText = `Точность ${value.toFixed(2)}`;
        }
      });

      item.addEventListener('mouseout', resetTip);
    });

    window.addEventListener('scroll', resetTip);
    window.addEventListener('touchmove', resetTip);
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (messages.length !== 0 && !loaded) {
      setLoaded(true);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [messages, loaded]);

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
        <div className={s.ChatPage__contentInner} ref={textRef}>
          {messages.map((message, messageIndex, { length }) => {
            let title = '';
            let text = '';
            let hints: string[] = [];
            if (message.type === MessageType.me) {
              text = message.text;
            } else {
              const item = message.data?.[message.active];
              title = item?.title || '';
              text = message.text || item?.article || '';
              hints = message.data?.map((i) => i.title) || [];
              const entry = item?.entry;
              const entry_ends = item?.entry_ends;
              const score = (item?.score || 0).toFixed(2);

              if (typeof entry === 'number' && typeof entry_ends === 'number') {
                if (entry === -1) {
                  title = `<span class="hintText" style="background-color: var(--accent-light)" data-value="${score}">${title}</span>`;
                } else {
                  text =
                    text.slice(0, entry) +
                    `<span class="hintText" style="background-color: var(--accent-light)" data-value="${score}">${text.slice(
                      entry,
                      entry_ends
                    )}</span>` +
                    text.slice(entry_ends);
                }
              }
            }

            return (
              !!text && (
                <MessageContainer
                  className={clsx('message', {
                    [s.ChatPage__messageContainer_right]: message.type === MessageType.me,
                    [s.ChatPage__messageContainer_left]: message.type === MessageType.them
                  })}
                  placement={message.type === MessageType.me ? MessagePlacement.right : MessagePlacement.left}
                  loaded={loaded}
                  key={messageIndex}>
                  <Message
                    className={s.ChatPage__message}
                    variant={message.type === MessageType.me ? MessageVariant.primary : MessageVariant.secondary}
                    placement={message.type === MessageType.me ? MessagePlacement.right : MessagePlacement.left}
                    title={normalizeText(title)}>
                    {normalizeText(text)}
                  </Message>

                  {message.type === MessageType.them && message.hints && message.hints.length !== 0 && (
                    <div className={s.ChatPage__hintContainer}>
                      {message.hints.map((hint, index) => (
                        <Button
                          className={s.ChatPage__hint}
                          classes={{ text: s.ChatPage__hintText }}
                          variant={ButtonVariant.tertiary}
                          size={ButtonSize.small_x}
                          key={index}
                          onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            onSubmit(hint);
                          }}
                          disabled={messageIndex !== length - 1}>
                          {hint}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.type === MessageType.them && hints.length !== 0 && messageIndex === length - 1 && (
                    <div className={s.ChatPage__hintContainer}>
                      {hints.map((hint, index) => (
                        <Button
                          className={s.ChatPage__hint}
                          classes={{ text: s.ChatPage__hintText }}
                          variant={index === message.active ? ButtonVariant.primary : ButtonVariant.tertiary}
                          size={ButtonSize.small_x}
                          key={index}
                          onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            const messageIndex = messages.findIndex((i) => i === message);
                            setMessages((msgs) => [
                              ...msgs.slice(0, messageIndex),
                              { ...message, active: index },
                              ...msgs.slice(messageIndex + 1)
                            ]);
                          }}
                          disabled={messageIndex !== length - 1 || index === message.active}
                          title={hint}>
                          {normalizeText(hint.length > 100 ? hint.slice(0, 100) + '...' : hint)}
                        </Button>
                      ))}
                    </div>
                  )}
                </MessageContainer>
              )
            );
          })}
        </div>
        <div className={s.ChatPage__textTip} ref={tipRef} />
      </div>

      <div className={s.ChatPage__formOuter}>
        <Container>
          <ChatInput
            value={value}
            setValue={setValue}
            onSubmit={onSubmit}
            inputRef={inputRef}
            buttonDisabled={value === ''}
            // inputHints={['Страница контракта организации']}
            onClickHint={(hint) => onSubmit(hint)}
          />
        </Container>
      </div>
    </div>
  );
};
