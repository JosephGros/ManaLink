import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

async function AdminAndModeratorLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/login');
  }

  let decodedToken;

  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    decodedToken = jwt.verify(token, jwtSecret) as { role: string };
    console.log("Decoded Token:", decodedToken);

  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return redirect('/home');
  }

  if (decodedToken.role !== 'admin' && decodedToken.role !== 'moderator') {
    console.log('Redirecting to /not-authorized due to insufficient role');
    return redirect('/not-authorized');
  }

  return <>{children}</>;
}

export default AdminAndModeratorLayout;
