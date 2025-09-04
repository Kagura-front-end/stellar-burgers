import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { LoginUI } from '@ui-pages';
import {
  loginUserThunk,
  selectUserError,
  selectAuthSubmitting,
  selectIsAuth,
} from '../../services/user/user.slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const errorText = useAppSelector(selectUserError);
  const submitting = useAppSelector(selectAuthSubmitting);
  const isAuth = useAppSelector(selectIsAuth);

  const redirectTo =
    (location.state as { from?: Location } | undefined)?.from?.pathname ?? '/profile';

  useEffect(() => {
    if (isAuth) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuth, navigate, redirectTo]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      await dispatch(loginUserThunk({ email, password })).unwrap();
      navigate(redirectTo, { replace: true });
    } catch (err) {}
  };

  return (
    <>
      <LoginUI
        errorText={errorText || ''}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      <p className='text text_type_main-default text_color_inactive'>
        Вы — новый пользователь?{' '}
        <Link to='/register' state={{ from: location }}>
          Зарегистрироваться
        </Link>
      </p>
    </>
  );
};
