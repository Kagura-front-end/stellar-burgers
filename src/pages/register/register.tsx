import { FC, SyntheticEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { RegisterUI } from '@ui-pages';
import { registerUserThunk } from '../../services/user/user.slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const errorText = useAppSelector((s) => s.user.error ?? '');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const res = await dispatch(registerUserThunk({ name: userName, email, password }) as any);
    if (res.meta.requestStatus === 'fulfilled') {
      const to = (location.state as any)?.from?.pathname ?? '/';
      navigate(to, { replace: true });
    }
  };

  return (
    <>
      <RegisterUI
        errorText={errorText}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        userName={userName}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />

      <p className='text text_type_main-default text_color_inactive'>
        Уже зарегистрированы?{' '}
        <Link to='/login' state={{ from: location }}>
          Войти
        </Link>
      </p>
    </>
  );
};
