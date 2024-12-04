import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../service/firebase.js';

const auth = getAuth(app);

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Attempt login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        console.log('Login successful.');

        // Return token and user details (excluding sensitive information)
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: userCredential
        });
    } catch (error) {
        console.error("Full error:", error);

        error.errors = ('Error signing in: '+ error.code);

        let errorMessage = 'Authentication failed';

        if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        }
        // res.status(400).json({ error: errorMessage });
        error.statusCode = 400;
        error.status = false;
        error.message = errorMessage;
        next(error)
    }
}

export { login };
