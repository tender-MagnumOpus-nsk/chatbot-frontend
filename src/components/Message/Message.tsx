import clsx from 'clsx';
import s from './Message.module.scss';
import { FC, RefObject } from 'react';

export enum MessageVariant {
  primary = 'primary',
  secondary = 'secondary'
}

export enum MessagePlacement {
  right = 'right',
  left = 'left'
}

export interface MessageProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
  classes?: {
    content?: string;
  };
  variant?: MessageVariant;
  placement?: MessagePlacement;
  children?: string;
  title?: string;
  contentRef?: RefObject<HTMLDivElement>;
}

export const Message: FC<MessageProps> = (props) => {
  const {
    children,
    className,
    classes,
    variant = MessageVariant.primary,
    placement = MessagePlacement.right,
    title,
    contentRef
  } = props;

  return (
    <div
      className={clsx(s.Message, s[`Message_variant_${variant}`], s[`Message_type_${placement}`], className)}
      ref={contentRef}>
      {title && <div className={s.Message__title} dangerouslySetInnerHTML={{ __html: `${title}<br /><br />` }} />}
      <div className={classes?.content} dangerouslySetInnerHTML={{ __html: children || '' }} />
    </div>
  );
};
