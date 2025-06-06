import { Provider } from 'react-redux';
import { renderHook, waitFor } from '@testing-library/react';
import { store } from '@/store';
import { useGetUsersQuery } from '@/store/userApi';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

test('should fetch users', async () => {
  const { result } = renderHook(() => useGetUsersQuery(1), { wrapper });

  // Wait for the API call to complete
  await waitFor(
    () => {
      expect(result.current.isSuccess).toBe(true);
    },
    { timeout: 3000 } // ← increase timeout to 3s
  );

  expect(result.current.data?.users.length).toBeGreaterThan(0);
});
