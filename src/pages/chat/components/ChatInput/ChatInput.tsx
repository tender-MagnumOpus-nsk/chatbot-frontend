import React, { Dispatch, MouseEvent, SetStateAction } from 'react';
import clsx from 'clsx';
import s from './ChatInput.module.scss';
import { ReactFCC } from '../../../../utils/ReactFCC';
import { Textarea } from '../../../../components/Textarea';
import { Button } from '../../../../components/Button';
import { ReactComponent as SendIcon } from './send.svg';
import { isKey } from '../../../../utils/isKey';
import { Key } from 'ts-key-enum';

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
}

export const ChatInput: ReactFCC<InputProps> = (props) => {
  const { className, value, setValue, onSubmit, inputRef, buttonDisabled } = props;

  return (
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
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onSubmit();
          }}
          disabled={buttonDisabled}>
          <SendIcon className={s.ChatInput__icon} />
        </Button>
      }
    />
  );
};
