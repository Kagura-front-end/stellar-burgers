import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

export type TAppHeaderUIProps = {
  userName?: string;
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName = '' }) => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      {/* left group */}
      <div className={styles.left}>
        <NavLink
          to='/'
          end
          className={({ isActive }) => (isActive ? styles.link_active : styles.link)}
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default'>Конструктор</span>
            </>
          )}
        </NavLink>

        <NavLink
          to='/feed'
          className={({ isActive }) => (isActive ? styles.link_active : styles.link)}
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default'>Лента заказов</span>
            </>
          )}
        </NavLink>
      </div>

      {/* center logo */}
      <div className={styles.logo}>
        <NavLink to='/'>
          <Logo className={styles.logoIcon} />
        </NavLink>
      </div>

      {/* right group */}
      <div className={styles.right}>
        <NavLink
          to='/profile'
          className={({ isActive }) => (isActive ? styles.link_active : styles.link)}
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default'>{userName || 'Личный кабинет'}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);

export default AppHeaderUI;
