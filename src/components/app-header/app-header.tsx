import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIsAuth, selectUser } from '../../services/user/user.slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const location = useLocation();
  const isAuth = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);

  return (
    <AppHeaderUI
      userName={user?.name ?? ''}
      profileTo={isAuth ? '/profile' : '/login'}
      profileState={!isAuth ? { from: location } : undefined}
    />
  );
};

export default AppHeader;
