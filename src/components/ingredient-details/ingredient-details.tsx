import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IngredientDetailsUI, Preloader } from '../ui';
import { useAppSelector } from '../../services/hooks';
import { selectIngredients } from '../../services/ingredients/ingredients.slice';

export const IngredientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) navigate('/', { replace: true });
  }, [id, navigate]);

  const items = useAppSelector(selectIngredients);
  const ingredientData = items.find((i) => i._id === id);

  if (!ingredientData) return <Preloader />;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
