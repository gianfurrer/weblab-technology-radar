import { getUser, login, logout } from '@src/controllers/authenticationController';
import { Router } from 'express';
import { body } from 'express-validator';
import { isAuthenticated } from './middleware/auth';
import { validate } from './middleware/validation';

const router = Router();

const loginValidation = [
  body('email')
    .exists()
    .withMessage("Parameter 'email' not provided")
    .bail()
    .isEmail()
    .withMessage('Invalid email address provided')
    .toLowerCase(),
  body('password')
    .exists()
    .withMessage("Parameter 'password' not provided")
    .bail()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

router.post('/login', validate(loginValidation), login);
router.post('/logout', isAuthenticated, logout);
router.get('/user', isAuthenticated, getUser);

export const AuthenticationRouterV1 = router;
