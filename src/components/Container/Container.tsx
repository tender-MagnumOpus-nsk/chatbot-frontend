import clsx from 'clsx';
import s from './Container.module.scss';
import { ReactFCC } from '../../utils/ReactFCC';

export interface ContainerProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
}

export const Container: ReactFCC<ContainerProps> = (props) => {
  const { children, className } = props;

  return <div className={clsx(s.Container, className)}>{children}</div>;
};
