import { FC, ReactNode } from 'react';
import styles from './constructor-page.module.css';
import { Preloader } from '../../';

export type ConstructorPageUIProps = {
  isLoading: boolean;
  children: ReactNode;
};

export const ConstructorPageUI: FC<ConstructorPageUIProps> = ({ isLoading, children }) => {
  if (isLoading) return <Preloader />;

  return (
    <main className={styles.containerMain}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>{children}</div>
    </main>
  );
};

export default ConstructorPageUI;
