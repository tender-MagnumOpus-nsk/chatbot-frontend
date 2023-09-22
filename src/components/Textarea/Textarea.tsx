import React, { ReactNode, useEffect, useRef } from 'react';
import clsx from 'clsx';
import composeRefs from '@seznam/compose-react-refs';
import s from './Textarea.module.scss';
import { IntrinsicPropsWithoutRef } from '../../utils/types';
import { useDelegateFocus } from '../../hooks/useDelegateFocus';
import { useFocus } from '../../hooks/useFocus';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface TextAreaProps extends Omit<IntrinsicPropsWithoutRef<'textarea'>, 'onClick' | 'onBlur'> {
  /**
   * Состояние ошибки
   */
  error?: boolean;
  /**
   * Проп для контролируемого включения состояния фокуса
   */
  focused?: boolean;
  /**
   * Ref на input-элемент
   */
  inputRef?: React.Ref<HTMLTextAreaElement>;
  /**
   * Обработчик нажатия на Input
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * Дополнительные css-классы элементов:
   * * root - внешний контейнер
   * * input - элемент input
   * * icon - иконки слева и справа Input
   * * iconLeft - иконка слева Input
   * * iconRight - иконка справа Input
   */
  classes?: {
    root?: string;
    icon?: string;
    iconLeft?: string;
    iconRight?: string;
    input?: string;
  };
  registration?: Partial<UseFormRegisterReturn>;

  right?: ReactNode | string;
}

export type InputType = React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<HTMLDivElement>>;

const TextareaForwardedRef = React.forwardRef<HTMLDivElement, TextAreaProps>(
  (
    {
      error,
      focused: focusedProp,
      className,
      classes,
      onClick,
      onInput,
      inputRef: inputRefProp,
      style,
      registration,
      right,
      value,
      ...inputProps
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const delegateProps = useDelegateFocus<HTMLDivElement, HTMLInputElement>(inputRef, { onClick });
    const { focused, ...focusProps } = useFocus({ ...inputProps, ...registration });

    if (inputRef.current) {
      inputRef.current.style.height = '1px';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.style.height = '1px';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
      }
    }, [value]);

    return (
      <div
        ref={ref}
        className={clsx(
          s.Input,
          {
            [s.Input_focus]: focusedProp ?? focused,
            [s.Input_error]: error,
            [s.Input_disabled]: inputProps.disabled
          },
          className,
          classes?.root
        )}
        style={style}
        {...delegateProps}>
        <textarea
          className={clsx(s.Input__input, { [s.Input__input_disabled]: inputProps.disabled }, classes?.input)}
          autoComplete={'off'}
          {...registration}
          // @ts-ignore
          ref={composeRefs(inputRef, inputRefProp, registration?.ref)}
          {...inputProps}
          {...focusProps}
          // @ts-ignore
          onInput={(e) => {
            if (inputRef.current) {
              inputRef.current.style.height = '1px';
              inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
            }
            setTimeout(() => {});
          }}
          value={value}
        />

        {right}
      </div>
    );
  }
);

TextareaForwardedRef.displayName = 'Input';

export const Textarea: InputType = TextareaForwardedRef;
