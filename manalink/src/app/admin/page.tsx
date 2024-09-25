import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

export default function AdminPage() {
  return (
    <div>
        <h1 className="text-textcolor">Welcome to the Admin Page</h1>
        <p className="text-textcolor">This content is for admins only.</p>

        <button className="bg-btn text-textcolor p-2 rounded-md mt-4">
            <a href="/">Home</a>
        </button>
    </div>
  );
}

// export async function AdminGuard() {
//   const cookieStore = cookies();
//   const token = cookieStore.get('token')?.value;

//   if (!token) {
//     redirect('/login');
//   }

//   try {
//     const jwtSecret = process.env.JWT_SECRET as string;

//     const decodedToken = jwt.verify(token, jwtSecret) as { role: string };

//     if (decodedToken.role !== 'admin') {
//       redirect('/not-authorized');
//     }
    
//     return null;
//   } catch (error) {
//     redirect('/login');
//   }
// }