import React, { FC, memo } from 'react';
import styles from './burger-constructor-element.module.css';
import { ConstructorElement } from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUIProps } from './type';
import { MoveButton } from '@zlden/react-developer-burger-ui-components';

export const BurgerConstructorElementUI: FC<BurgerConstructorElementUIProps> = memo(
  ({ ingredient, index, totalItems, handleMoveUp, handleMoveDown, handleClose }) => {
    const onMoveUp = () => handleMoveUp?.();
    const onMoveDown = () => handleMoveDown?.();

    const showMoveButtons = true;

    return (
      <div className={`${styles.element} ${styles.gripItem} mb-4 mr-2`}>
        {showMoveButtons ? (
          <MoveButton
            handleMoveDown={onMoveDown}
            handleMoveUp={onMoveUp}
            isUpDisabled={index === 0}
            isDownDisabled={index === totalItems - 1}
          />
        ) : null}
        <div className={`${styles.element_fullwidth} ${showMoveButtons ? 'ml-2' : ''}`}>
          <ConstructorElement
            text={ingredient.name}
            price={ingredient.price}
            thumbnail={ingredient.image}
            handleClose={handleClose}
          />
        </div>
      </div>
    );
  },
);
