import { FC, memo, useEffect, useId } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(({ title, onClose, children }) => {
  const labelId = useId();

  // ESC to close + lock page scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Add ESC listener
    document.addEventListener('keydown', handleEsc);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? labelId : undefined}
      >
        <div className={styles.header}>
          {title && (
            <h3 id={labelId} className={`${styles.title} text text_type_main-large`}>
              {title}
            </h3>
          )}
          <button className={styles.button} type='button' aria-label='Закрыть' onClick={onClose}>
            <CloseIcon type='primary' />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlayUI onClick={onClose} />
    </>
  );
});
