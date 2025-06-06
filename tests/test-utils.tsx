import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { store } from '@/store';

export const renderWithProvider = (ui: ReactNode) =>
  render(<Provider store={store}>{ui}</Provider>);
