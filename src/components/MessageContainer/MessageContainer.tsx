import clsx from 'clsx';
import s from './MessageContainer.module.scss';
import { ReactFCC } from '../../utils/ReactFCC';

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
}

export const MessageContainer: ReactFCC<MessageContainerProps> = (props) => {
  const { children, className, variant = MessageContainerVariant.primary } = props;

  return (
    <div className={clsx(s.MessageContainer, className, s[`MessageContainer_variant_${variant}`])}>
      <div className={s.MessageContainer__container}>{children}</div>
    </div>
  );
};
