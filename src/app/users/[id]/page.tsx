'use client';

import { use } from 'react';
import { useGetUserByIdQuery } from '@/store/userApi';
import Link from 'next/link';

export default function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  // ✅ unwrap the async params using React.use()
  const { id } = use(params);
  const userId = parseInt(id, 10);

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  if (isLoading) return <p className="p-6 text-black">Loading...</p>;
  if (error || !user) return <p className="p-6 text-red-500">User not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-black font-bold capitalize">User Details</h1>

      <div className="mt-4 flex flex-col gap-4 items-center">
        <img src={user.avatar} alt="User Avatar" className="w-72 h-72 rounded-full object-cover" />
        <div className="text-center *:text-black">
          <p className="text-3xl">{user.first_name} {user.last_name}</p>
          <p className="text-2xl">{user.email}</p>
        </div>

        <Link
          href="/"
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm capitalize"
        >
          Return
        </Link>
      </div>
    </div>
  );
}
