import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('[authMiddleware] Token received:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
  console.log('[authMiddleware] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET (using default: secret)');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'chain10challenge_secret_key_2024';
    const decoded = jwt.verify(token, secret);
    console.log('[authMiddleware] Token verified successfully, userId:', (decoded as any).id);
    (req as any).user = decoded;
    // Check if admin access is required (for admin routes)
    if (req.path.startsWith('/api/admin') && !(decoded as any).isAdmin) {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
  } catch (error: any) {
    console.error('[authMiddleware] JWT verification failed:', error.message);
    res.status(400).json({ error: 'Invalid token. ' + error.message });
  }
};

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  console.log('[adminMiddleware] Checking admin access for user:', req.user?.id, 'isAdmin:', req.user?.isAdmin);
  if (req.user && req.user.isAdmin) {
    console.log('[adminMiddleware] Admin access granted for user:', req.user.id);
    next();
  } else {
    console.log('[adminMiddleware] Admin access DENIED for user:', req.user?.id);
    res.status(403).json({ error: 'Admin access required.' });
  }
};