import UserListClient from '@/components/UserListClient';

// Server Component: Home page that fetches users and renders the client-side list
export default async function HomePage() {
  // Pass fetched data to the client component as initial props
  return (
    <UserListClient />
  );
}