'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useEditUserMutation, useDeleteUserMutation, User } from '@/store/userApi';

interface UserCardProps {
  user: User;
  page: number;
}

// A card component to display and manage individual user info
const UserCard = ({ user, page }: UserCardProps) => {
  const [editUserMutation] = useEditUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  // State for toggling edit mode
  const [editing, setEditing] = useState(false);

  // Local form state for editing user fields
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });

  // Handle user deletion
  const handleDelete = async () => {
    try {
      await deleteUserMutation({ id: user.id, page }).unwrap();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editUserMutation({ id: user.id, data: formData, page }).unwrap();
      setEditing(false);
    } catch (err) {
      console.error('Edit failed', err);
    }
  };

  // Update form data on input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-4/5 lg:w-full mx-auto border p-4 rounded-lg shadow bg-white md:flex justify-between items-center">
      <div className="flex items-center justify-evenly gap-4 text-black">
        <img
          src={user.avatar || './images.png'}
          alt={`${user.first_name} ${user.last_name}` || 'No Avatar'}
          className="w-12 h-12 rounded-full object-cover"
        />

        {editing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-2 w-full text-amber-950">
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border p-1 rounded"
              placeholder="First name"
            />
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border p-1 rounded"
              placeholder="Last name"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-1 rounded"
              placeholder="Email"
            />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-white px-3 rounded bg-red-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="font-semibold">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        )}
      </div>

      {!editing && (
        <div className="flex justify-center gap-2 mt-4 *:capitalize">
          <Link
            href={`/users/${user.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
          >
            details
          </Link>
          <button
            onClick={() => setEditing(true)}
            className="bg-purple-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
          >
            edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-purple-900 text-white px-3 py-1 rounded text-sm cursor-pointer"
          >
            remove
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
