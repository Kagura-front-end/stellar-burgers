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
  const hasMiddle = middle.length > 0; // ← added

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
        {hasMiddle ? (
          middle.map((item: TConstructorIngredient, index: number) => {
            const key =
              (item as any)?.uuid ??
              (item as any)?._id ??
              (item as any)?.id ??
              `${item.type}-${index}`;

            return (
              // ⬇️ wrapper <li> gets the grip via CSS (::before)
              <li key={key} className={`${styles.element} ${styles.gripItem} mb-4 mr-5`}>
                <div className={styles.element_fullwidth}>
                  <BurgerConstructorElement
                    ingredient={item}
                    index={index}
                    totalItems={middle.length}
                  />
                </div>
              </li>
            );
          })
        ) : (
          <li className={`${styles.noItems} ml-8 mb-4 mr-5 text text_type_main-default`}>
            Выберите начинку и соусы
          </li>
        )}
      </ul>

      {/* Bottom bun */}
      {constructorItems.bun ? (
        <div className={`${styles.element} ${hasMiddle ? styles.bottomGap : ''} mr-4`}>
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
          className={`${styles.noBuns} ${styles.noBunsBottom} ${
            hasMiddle ? styles.bottomGap : ''
          } ml-8 mr-5 text text_type_main-default`}
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
