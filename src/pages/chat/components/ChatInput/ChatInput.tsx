import React, { Dispatch, MouseEvent, SetStateAction, useRef, useState } from 'react';
import clsx from 'clsx';
import s from './ChatInput.module.scss';
import { ReactFCC } from '../../../../utils/ReactFCC';
import { Textarea } from '../../../../components/Textarea';
import { Button, ButtonVariant } from '../../../../components/Button';
import { ReactComponent as SendIcon } from './send.svg';
import { isKey } from '../../../../utils/isKey';
import { Key } from 'ts-key-enum';
import { useClickOutside } from '../../../../hooks/useClickOutside';

export interface InputProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  buttonDisabled?: boolean;
  inputHints?: string[];
  onClickHint?: (hint: string) => void;
}

export const ChatInput: ReactFCC<InputProps> = (props) => {
  const { className, value, setValue, onSubmit, inputRef, buttonDisabled, inputHints, onClickHint } = props;

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useClickOutside({
    ref: containerRef,
    callback: () => setDropdownVisible(false),
    isWithKeyEsc: true
  });

  return (
    <div className={s.ChatInput__container} ref={containerRef}>
      <Textarea
        className={clsx(s.ChatInput, className)}
        classes={{
          input: s.ChatInput__input
        }}
        placeholder={'Введите сообщение'}
        onKeyDown={(e) => {
          if (isKey(e.nativeEvent, Key.Enter) && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputRef={inputRef}
        right={
          <Button
            className={s.ChatInput__button}
            variant={ButtonVariant.primary}
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              onSubmit();
            }}
            disabled={buttonDisabled}>
            <SendIcon className={s.ChatInput__icon} />
          </Button>
        }
        onFocus={() => setDropdownVisible(true)}
        onClick={(e) => e.stopPropagation()}
      />

      {dropdownVisible && value && inputHints && inputHints.length !== 0 && (
        <div className={clsx(s.ChatInput__dropdown)} onClick={(e) => e.stopPropagation()}>
          {inputHints.map((hint, index) => (
            <button
              className={s.ChatInput__dropdownItem}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                onClickHint?.(hint);
              }}>
              {hint}
            </button>
          ))}
          {/*<button className={s.ChatInput__dropdownItem}>Подсказка при введении текста 2</button>*/}
        </div>
      )}
    </div>
  );
};
