import { Outlet } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';

const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);

export default App;
