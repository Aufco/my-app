import { getIronSession } from 'iron-session';

export const sessionOptions = {
  password: 'complex_password_at_least_32_characters_long',  // In production, use a strong password
  cookieName: 'spanish-story-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Middleware for API routes
export async function withSession(req, res, next) {
  req.session = await getIronSession(req, res, sessionOptions);
  return next();
}

// For SSR pages
export async function getServerSideProps({ req, res }) {
  const session = await getIronSession(req, res, sessionOptions);
  
  return {
    props: {
      user: session.user || null,
    },
  };
}