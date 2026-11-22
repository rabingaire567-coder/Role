import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** Lets the global confirmation dialog open screens outside the React tree. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
