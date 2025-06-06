import { renderWithProvider } from './test-utils';
import { screen, fireEvent } from '@testing-library/react';
import UserListClient from '@/components/UserListClient';

test('shows add form and accepts input', async () => {
  document.cookie = `token=${btoa('test@example.com:password')}`;

  renderWithProvider(<UserListClient />);

  const addButton = await screen.findByText(/add user/i);
  fireEvent.click(addButton);

  const input = screen.getByPlaceholderText(/first name/i);
  fireEvent.change(input, { target: { value: 'Ali' } });

  expect(screen.getByDisplayValue('Ali')).toBeInTheDocument();
});
