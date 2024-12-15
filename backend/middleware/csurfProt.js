import csurf from 'csurf';

const csrfProtection = csurf({
    cookie: {
        httpOnly: true, // Prevent client-side access
        secure: false,  // Use true in production
        sameSite: 'Strict',
    },
});

export default csrfProtection;