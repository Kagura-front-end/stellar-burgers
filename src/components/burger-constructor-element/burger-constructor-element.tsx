import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '../../services/hooks';
import { removeItem } from '../../services/constructor/constructor.slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {};
    const handleMoveUp = () => {};

    // remove by uuid (expected by the slice). fallback: index as string
    const handleClose = () => {
      const id = (ingredient as any)?.uuid ?? String(index);
      dispatch(removeItem(id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  },
);
