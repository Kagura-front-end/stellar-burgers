import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderNumber,
  onOrderClick,
  closeOrderModal,
}) => {
  const middle: TConstructorIngredient[] = constructorItems.ingredients;

  return (
    <section className={styles.burger_constructor}>
      {/* Top bun */}
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      {/* Middle (scrollable) */}
      <ul className={styles.elements}>
        {middle.length > 0 ? (
          middle.map((item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={middle.length}
              key={
                // robust key with fallbacks; use `as any` to allow optional uuid/id
                (item as any)?.uuid ??
                (item as any)?._id ??
                (item as any)?.id ??
                `${item.type}-${index}`
              }
            />
          ))
        ) : (
          <li className={`${styles.noItems} ml-8 mb-4 mr-5 text text_type_main-default`}>
            Выберите начинку и соусы
          </li>
        )}
      </ul>

      {/* Bottom bun */}
      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button htmlType='button' type='primary' size='large' onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>

      {orderRequest && (
        <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
          <Preloader />
        </Modal>
      )}

      {typeof orderNumber === 'number' && (
        <Modal onClose={closeOrderModal} title={orderRequest ? 'Оформляем заказ...' : ''}>
          <OrderDetailsUI orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};

export default BurgerConstructorUI;
