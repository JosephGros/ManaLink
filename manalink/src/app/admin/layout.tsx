import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decodedToken;

  try {
    const jwtSecret = process.env.JWT_SECRET as string;

    decodedToken = jwt.verify(token, jwtSecret) as { role: string };
    console.log("Decoded Token:", decodedToken);

  } catch (error:any) {
        console.error('Error verifying token:', error.message);
        return redirect('/');
  }


    if (decodedToken.role !== 'admin') {
        console.log('Redirecting to /not-authorized due to non-admin role');
        redirect('/not-authorized');
    }

    return <>{children}</>;

};

export default AdminLayout;