'use client';

import './globals.css';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="ltr">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
