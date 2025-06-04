'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import UserCard from './UserCard';
import Pagination from './Pagination';
import AuthModal from './LoginModal';
import { useAddUserMutation, useGetUsersQuery, userApi } from '@/store/userApi';

export default function UserListClient() {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);

  // Fetch users for the current page
  const { data, error, isLoading } = useGetUsersQuery(page);

  // Mutation hook to add a user
  const [addUserMutation] = useAddUserMutation();

  // Login state
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  // Toggle for add user form
  const [add, setAdd] = useState(false);

  // State for new user form inputs
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  });

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler to add a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = Date.now();
      await addUserMutation({ data: { ...newUser, id }, page }).unwrap();
      setNewUser({ first_name: '', last_name: '', email: '', avatar: '' });
      setAdd(false);
    } catch (err) {
      console.error('Add user failed:', err);
    }
  };

  // Clear token on logout
  const logout = () => {
    document.cookie = 'token=; max-age=0; path=/;';
    setIsLoginOpen(true);
  };

  // Show loading or error states
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  return (
    <div className="p-6">
      {/* If not logged in, show login modal */}
      {isLoginOpen ? (
        <AuthModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onAuthSuccess={(token) => {
            console.log('Authenticated with token:', token);
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 capitalize">
            <h1 className="text-2xl text-black font-bold">User List</h1>

            <button
              onClick={async () => {
                if (!data?.totalPages) return;

                try {
                  const promises = [];
                  for (let i = 1; i <= data.totalPages; i++) {
                    promises.push(
                      dispatch(
                        userApi.endpoints.getUsers.initiate(i, { forceRefetch: true })
                      )
                    );
                  }
                  await Promise.all(promises);
                } catch (err) {
                  console.error('Failed to reload users:', err);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded capitalize"
            >
              reload
            </button>
          </div>

          {!add && (
            <button
              onClick={() => setAdd(true)}
              className="bg-blue-900 m-2 cursor-pointer p-2 rounded-full capitalize"
            >
              add user ➕
            </button>
          )}

          {add && (
            <form
              onSubmit={handleAddUser}
              className="mb-6 p-4 bg-gray-100 rounded shadow flex flex-wrap w-4/5 items-center m-auto gap-2"
            >
              <h2 className="text-lg w-full font-semibold text-black">Add New User</h2>

              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={newUser.first_name}
                onChange={handleInputChange}
                className="border p-2 rounded text-black"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={newUser.last_name}
                onChange={handleInputChange}
                className="border p-2 rounded text-black"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
                className="border p-2 rounded text-black"
                required
              />
              <input
                type="text"
                name="avatar"
                placeholder="Avatar URL"
                value={newUser.avatar}
                onChange={handleInputChange}
                className="border p-2 rounded text-black"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white p-1 rounded capitalize"
                >
                  add user
                </button>
                <button
                  type="button"
                  className="bg-purple-950 text-white p-1 rounded capitalize"
                  onClick={() => setAdd(false)}
                >
                  close
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {data?.users.map((user) => (
              <UserCard key={user.id} user={user} page={page} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />

          <button
            onClick={logout}
            className="bg-blue-600 text-white px-4 py-2 rounded mb-4 cursor-pointer capitalize fixed right-5 bottom-0"
          >
            logout
          </button>
        </>
      )}
    </div>
  );
}
