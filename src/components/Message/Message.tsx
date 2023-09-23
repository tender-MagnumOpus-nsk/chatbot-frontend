import clsx from 'clsx';
import s from './Message.module.scss';
import { FC, useEffect, useState } from 'react';

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

  const [mounted, setMounted] = useState(false);
  //
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  return (
    <div
      className={clsx(s.Message, s[`Message_variant_${variant}`], s[`Message_type_${type}`], className, {
        [s.Message_mounted]: mounted
      })}
      dangerouslySetInnerHTML={{ __html: children || '' }}
    />
  );
};
