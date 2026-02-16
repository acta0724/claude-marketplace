import { Router, Request, Response } from 'express';
import { authService } from './authService';
import { SignupRequest } from './types';

export const authRouter = Router();

authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const signupRequest: SignupRequest = req.body;
    
    if (!signupRequest.email || !signupRequest.password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const user = await authService.signup(signupRequest);
    
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      // Validation errors or duplicate user
      if (error.message.includes('already exists') || 
          error.message.includes('required') ||
          error.message.includes('Invalid') ||
          error.message.includes('must')) {
        return res.status(400).json({
          error: error.message
        });
      }
    }
    
    // Internal server error
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});
