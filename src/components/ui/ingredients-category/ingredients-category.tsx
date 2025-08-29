import { forwardRef, RefObject, ReactNode } from 'react';
import styles from './ingredients-category.module.css';

export type IngredientsCategoryUIProps = {
  title: string;
  titleRef?: RefObject<HTMLHeadingElement>;
  children: ReactNode;
};

const IngredientsCategoryUI = forwardRef<HTMLDivElement, IngredientsCategoryUIProps>(
  ({ title, titleRef, children }, ref) => (
    <section className={styles.section}>
      <h2 ref={titleRef} className='text text_type_main-medium'>
        {title}
      </h2>
      {/* Scrollable grid with proper items wrapper */}
      <div ref={ref} className={styles.grid} data-testid='scrollable-container'>
        <div className={styles.items}>{children}</div>
      </div>
    </section>
  ),
);

export default IngredientsCategoryUI;
