import clsx from 'clsx';
import s from './Header.module.scss';
import { ReactFCC } from '../../../../utils/ReactFCC';

export interface HeaderProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
}

export const Header: ReactFCC<HeaderProps> = (props) => {
  const { className } = props;

  return <div className={clsx(s.Header, className)}></div>;
};
