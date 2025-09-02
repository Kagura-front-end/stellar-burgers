import { useMemo } from 'react';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredients/ingredients.slice';
import type { TIngredient } from '@utils-types';

// Import the UI version and its prop types
import UIOrderCard, {
  type OrderCardUIProps as UIOrderCardProps,
} from '../ui/order-card/order-card';

type Props = Omit<UIOrderCardProps, 'ingredients'>;

export default function OrderCard(props: Props) {
  const allIngredients = useAppSelector(selectIngredients);

  const resolvedIngredients = useMemo(
    () =>
      props.order.ingredients
        .map((id) => allIngredients.find((i) => i._id === id))
        .filter((i): i is TIngredient => Boolean(i)),
    [props.order.ingredients, allIngredients],
  );

  return <UIOrderCard {...props} ingredients={resolvedIngredients} />;
}

// (Optional) Re-export UI prop types if other code needs them:
export type { OrderCardUIProps } from '../ui/order-card/order-card';
