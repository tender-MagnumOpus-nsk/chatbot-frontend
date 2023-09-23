import clsx from 'clsx';
import s from './MessageContainer.module.scss';
import { ReactFCC } from '../../utils/ReactFCC';
import { useEffect, useState } from 'react';
import { MessagePlacement } from '../Message';

export enum MessageContainerVariant {
  primary = 'primary',
  secondary = 'secondary'
}

export interface MessageContainerProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
  variant?: MessageContainerVariant;
  placement?: MessagePlacement;
}

export const MessageContainer: ReactFCC<MessageContainerProps> = (props) => {
  const { children, className, variant = MessageContainerVariant.primary, placement = MessagePlacement.right } = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={clsx(s.MessageContainer, className, s[`MessageContainer_variant_${variant}`], {
        [s.MessageContainer_mounted]: mounted,
        [s.MessageContainer_right]: placement === MessagePlacement.right,
        [s.MessageContainer_left]: placement === MessagePlacement.left
      })}>
      <div className={s.MessageContainer__container}>{children}</div>
    </div>
  );
};
