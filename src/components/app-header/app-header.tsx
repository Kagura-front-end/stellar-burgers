import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import type { RootState } from '../../services/store';

// If your @ui barrel re-exports AppHeaderUI:
import { AppHeaderUI } from '@ui';
// If that fails, use direct import:
// import { AppHeaderUI } from '../ui/app-header/app-header';

export const AppHeader: FC = () => {
  const userName = useAppSelector((s: RootState) => s.user?.user?.name ?? '');
  return <AppHeaderUI userName={userName} />;
};

export default AppHeader;
