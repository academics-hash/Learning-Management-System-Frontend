'use client';

import { Provider } from 'react-redux';
import { appStore } from '../utils/store';

export default function StoreProvider({ children }) {
    return <Provider store={appStore}>{children}</Provider>;
}
