import React, { FC } from 'react';
import { FeedInfoUI } from '../ui/feed-info/feed-info';
import type { FeedInfoUIProps } from '../ui/feed-info/type';

/**
 * Thin wrapper around the UI component to preserve old import paths:
 *   import { FeedInfo } from '@components'
 */
export const FeedInfo: FC<FeedInfoUIProps> = (props) => <FeedInfoUI {...props} />;

export default FeedInfo;

export type { FeedInfoUIProps } from '../ui/feed-info/type';
