import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { useAppDispatch } from '../../services/hooks';
import { removeItem } from '../../services/constructor/constructor.slice';
import type { TConstructorItem } from '../../services/constructor/constructor.slice';

type Props = {
  ingredient: TConstructorItem;
  index?: number;
};

export const BurgerConstructorElement: FC<Props> = memo(({ ingredient }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(removeItem(ingredient.uuid));
  };

  return <BurgerConstructorElementUI ingredient={ingredient} onClose={handleClose} />;
});

export default BurgerConstructorElement;
