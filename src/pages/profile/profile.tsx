import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchUser,
  selectUser,
  selectUserLoading,
  selectUserUpdating,
  updateUser,
  logoutUserThunk,
} from '../../services/user/user.slice';
import { ProfileMenuUI } from '@ui';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css'; // add this file (see below)

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectUserLoading);
  const updating = useAppSelector(selectUserUpdating);

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, password: '' });
  }, [user]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    return form.name !== user.name || form.email !== user.email || form.password !== '';
  }, [form, user]);

  const onChange =
    (field: 'name' | 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const onCancel = () => {
    if (!user) return;
    setForm({ name: user.name, email: user.email, password: '' });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: { name?: string; email?: string; password?: string } = {};
    if (form.name !== user?.name) payload.name = form.name;
    if (form.email !== user?.email) payload.email = form.email;
    if (form.password) payload.password = form.password;
    if (Object.keys(payload).length) dispatch(updateUser(payload));
  };

  const onLogout = async () => {
    await dispatch(logoutUserThunk() as any);
    navigate('/login', { replace: true, state: { from: location } });
  };

  if (loading) return null;

  return (
    <div className={styles.page}>
      <aside className={styles.menu}>
        <ProfileMenuUI pathname={location.pathname} handleLogout={onLogout} />
      </aside>

      <section className={styles.content}>
        <form className={styles.form} onSubmit={onSubmit}>
          <Input
            placeholder='Имя'
            value={form.name}
            onChange={onChange('name')}
            name='name'
            icon='EditIcon'
          />
          <EmailInput value={form.email} onChange={onChange('email')} name='email' isIcon />
          <PasswordInput
            value={form.password}
            onChange={onChange('password')}
            name='password'
            icon='EditIcon'
          />

          {isDirty && (
            <div className={styles.actions}>
              <Button
                htmlType='button'
                type='secondary'
                size='medium'
                onClick={onCancel}
                disabled={updating}
              >
                Отмена
              </Button>
              <Button htmlType='submit' type='primary' size='medium' disabled={updating}>
                Сохранить
              </Button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};
