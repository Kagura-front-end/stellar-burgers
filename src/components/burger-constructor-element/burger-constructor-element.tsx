import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/hooks';
import { removeItem } from '../../services/constructor/constructor.slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index }) => {
    const dispatch = useAppDispatch();

    const handleClose = () => {
      const id =
        (ingredient as any)?.uuid ??
        (typeof index === 'number' ? String(index) : undefined) ??
        (ingredient as any)?._id; // final fallback if present
      if (id) dispatch(removeItem(id));
    };

    return <BurgerConstructorElementUI ingredient={ingredient} onClose={handleClose} />;
  },
);

export default BurgerConstructorElement;
