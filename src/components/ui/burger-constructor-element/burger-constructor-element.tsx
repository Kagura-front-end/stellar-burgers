import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';

type Props = {
  ingredient: { name: string; price: number; image: string };
  onClose: () => void;
};

export const BurgerConstructorElementUI = ({ ingredient, onClose }: Props) => (
  <ConstructorElement
    text={ingredient.name}
    price={ingredient.price}
    thumbnail={ingredient.image}
    handleClose={onClose}
  />
);
