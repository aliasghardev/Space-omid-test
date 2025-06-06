import { screen } from '@testing-library/react';
import { renderWithProvider } from './test-utils';
import UserCard from '@/components/UserCard';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  avatar: 'https://example.com/avatar.jpg',
};

describe('UserCard', () => {
  it('renders user full name and email', () => {
    renderWithProvider(<UserCard user={mockUser} page={1} />);
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
