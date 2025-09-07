import { FC, useRef } from 'react';
import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@zlden/react-developer-burger-ui-components';
import { BurgerConstructorElementUI } from '../burger-constructor-element/burger-constructor-element';
import styles from './burger-constructor.module.css';
import { Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';
import type { BurgerConstructorUIProps } from './type';
import { useDrag, useDrop } from 'react-dnd';
import clsx from 'clsx';

const DND_ITEM = 'FILLING';

type DraggableFillingProps = {
  item: { uuid: string; name: string; price: number; image: string };
  index: number;
  onMove?: (from: number, to: number) => void;
  onRemove: (item: { uuid: string }) => void;
};

const DraggableFilling: FC<DraggableFillingProps> = ({ item, index, onMove, onRemove }) => {
  const ref = useRef<HTMLLIElement | null>(null);

  const [, drop] = useDrop<{ index: number }>({
    accept: DND_ITEM,
    hover(drag) {
      if (!ref.current) return;
      if (drag.index === index) return;
      onMove?.(drag.index, index);
      drag.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DND_ITEM,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={clsx(styles.row, styles.draggable, { [styles.dragging]: isDragging })}
      data-cy='filling-item'
    >
      <button className={styles.rowHandle} aria-label='Переместить' />
      <div className={styles.rowTab}>
        <BurgerConstructorElementUI ingredient={item} onClose={() => onRemove(item)} />
      </div>
    </li>
  );
};

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  handleRemove,
  price,
  orderRequest,
  orderNumber,
  onOrderClick,
  closeOrderModal,
  onMove,
}) => (
  <section className={styles.burger_constructor}>
    {constructorItems.bun ? (
      <div className={styles.edgeFrame}>
        <div className={`${styles.row} ${styles.rowTop}`}>
          <button
            className={styles.rowHandle}
            type='button'
            aria-hidden='true'
            tabIndex={-1}
            disabled
          />
          <div className={styles.rowTab}>
            <ConstructorElement
              type='top'
              isLocked
              text={`${constructorItems.bun.name} (верх)`}
              price={constructorItems.bun.price}
              thumbnail={constructorItems.bun.image}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.edgeFrame}>
        <div className={`${styles.row} ${styles.rowTop}`}>
          <span className={styles.rowHandle} aria-hidden='true' />
          <div className={styles.rowTab}>
            <div className={`${styles.noBuns} ${styles.noBunsTop}`}>
              <span className='text text_type_main-default text_color_inactive'>
                Выберите булки
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className={styles.scrollArea}>
      <ul className={styles.list} data-cy='constructor-fillings'>
        {constructorItems.middle.length ? (
          constructorItems.middle.map((it, idx) => (
            <DraggableFilling
              key={it.uuid}
              item={it}
              index={idx}
              onMove={onMove}
              onRemove={handleRemove}
            />
          ))
        ) : (
          <li className={styles.row}>
            <span className={styles.rowHandle} aria-hidden='true' />
            <div className={styles.rowTab}>
              <div className={styles.noBuns}>
                <span className='text text_type_main-default text_color_inactive'>
                  Выберите начинку
                </span>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>

    {constructorItems.bun ? (
      <div className={styles.edgeFrame} data-cy='drop-buns'>
        <div className={`${styles.row} ${styles.rowBottom}`}>
          <button
            className={styles.rowHandle}
            type='button'
            aria-hidden='true'
            tabIndex={-1}
            disabled
          />
          <div className={styles.rowTab}>
            <ConstructorElement
              type='bottom'
              isLocked
              text={`${constructorItems.bun.name} (низ)`}
              price={constructorItems.bun.price}
              thumbnail={constructorItems.bun.image}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.edgeFrame} data-cy='drop-buns'>
        <div className={`${styles.row} ${styles.rowBottom}`}>
          <span className={styles.rowHandle} aria-hidden='true' />
          <div className={styles.rowTab}>
            <div className={`${styles.noBuns} ${styles.noBunsBottom}`}>
              <span className='text text_type_main-default text_color_inactive'>
                Выберите булки
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className={`${styles.total} mt-10 mr-4`} data-cy='constructor_total'>
      <div className={`${styles.cost} mr-10`} aria-label='Итоговая стоимость'>
        <span className={styles.totalText}>{price}</span>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        onClick={onOrderClick}
        disabled={!constructorItems.bun || !constructorItems.middle.length}
        data-cy='order-button'
      >
        Оформить заказ
      </Button>
    </div>

    {orderRequest && (
      <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
        <Preloader />
      </Modal>
    )}

    {orderNumber !== null && !orderRequest && (
      <Modal onClose={closeOrderModal} title=''>
        <OrderDetailsUI orderNumber={orderNumber} />
      </Modal>
    )}
  </section>
);

export { BurgerConstructorUI as default };
