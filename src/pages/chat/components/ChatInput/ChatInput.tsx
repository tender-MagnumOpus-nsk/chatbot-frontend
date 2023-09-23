import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react';
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
  onSubmit: (value?: string) => void;
  inputRef?: React.Ref<HTMLTextAreaElement>;
  disabled?: boolean;
  inputHints?: string[];
}

export const ChatInput: ReactFCC<InputProps> = (props) => {
  const { className, value, setValue, onSubmit, inputRef, disabled, inputHints } = props;

  const [activeHint, setActiveHint] = useState(-1);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveHint(-1);
  }, [inputHints, dropdownVisible]);

  useClickOutside({
    ref: containerRef,
    callback: () => setDropdownVisible(false),
    isWithKeyEsc: true
  });

  const paginate = (amount: 1 | -1) => {
    setActiveHint((currentHint) => {
      let index = currentHint + amount;
      if (index >= (inputHints?.length || 0)) {
        index = 0;
      } else if (index < 0) {
        index = inputHints?.length ? inputHints.length - 1 : 0;
      }
      return index;
    });
  };

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

            if (disabled) {
              return;
            }

            if (activeHint !== -1 && inputHints && inputHints[activeHint]) {
              onSubmit(inputHints[activeHint]);
            } else {
              onSubmit();
            }
          }

          if (isKey(e.nativeEvent, [Key.ArrowUp, Key.ArrowDown])) {
            e.preventDefault();
            paginate(isKey(e.nativeEvent, Key.ArrowDown) ? 1 : -1);
          }
        }}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setDropdownVisible(true);
        }}
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
            disabled={disabled}>
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
              className={clsx(s.ChatInput__dropdownItem, {
                [s.ChatInput__dropdownItem_hovered]: activeHint === index
              })}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                onSubmit(hint);
              }}
              onMouseOver={() => setActiveHint(index)}
              title={hint}>
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
