import clsx from 'clsx';
import s from './Message.module.scss';
import { FC } from 'react';

export enum MessageVariant {
  primary = 'primary',
  secondary = 'secondary'
}

export enum MessageType {
  right = 'right',
  left = 'left'
}

export interface MessageProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
  variant?: MessageVariant;
  type?: MessageType;
  children?: string;
}

export const Message: FC<MessageProps> = (props) => {
  const { children, className, variant = MessageVariant.primary, type = MessageType.right } = props;

  return (
    <div
      className={clsx(s.Message, s[`Message_variant_${variant}`], s[`Message_type_${type}`], className)}
      dangerouslySetInnerHTML={{ __html: children || '' }}
    />
  );
};
