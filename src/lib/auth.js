import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from './db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const users = await query('SELECT * FROM admins WHERE username = ?', [
          credentials.username,
        ]);

        if (users.length === 0) return null;

        const user = users[0];
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);

        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.full_name || user.username,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
