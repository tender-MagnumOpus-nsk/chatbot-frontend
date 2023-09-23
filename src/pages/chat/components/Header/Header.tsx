import clsx from 'clsx';
import s from './Header.module.scss';
import { ReactFCC } from '../../../../utils/ReactFCC';
import mopusLogoSrc from './assets/mopus-logo.svg';
import portalLogoSrc from './assets/portal-logo.svg';
import { Link } from 'react-router-dom';
import { CHAT_PAGE_ROUTE, TOKEN_PAGE_ROUTE } from '../../../../app/routes';

export interface HeaderProps {
  /**
   * Дополнительный css-класс
   */
  className?: string;
}

export const Header: ReactFCC<HeaderProps> = (props) => {
  const { className } = props;

  return (
    <div className={clsx(s.Header, className)}>
      <a className={s.Header__link} href="https://zakupki.mos.ru/">
        <img className={clsx(s.Header__logo)} src={portalLogoSrc} alt={''} />
      </a>

      <Link className={s.Header__link} to={TOKEN_PAGE_ROUTE} reloadDocument>
        <img className={clsx(s.Header__logo)} src={mopusLogoSrc} alt={''} />
      </Link>
    </div>
  );
};
