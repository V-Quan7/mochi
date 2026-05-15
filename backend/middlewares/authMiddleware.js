import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// Middleware kiểm tra đăng nhập
export const requireAuth = ClerkExpressWithAuth();

// Middleware kiểm tra admin
export const isAdmin = (req, res, next) => {

  console.log(req.auth);

  const role =
    req.auth.sessionClaims?.public_metadata?.role ||
    req.auth.sessionClaims?.private_metadata?.role;

  console.log("ROLE:", role);

  if (role !== "admin") {
    return res.status(403).json({
      message: "Lỗi: Bạn không có quyền Admin!"
    });
  }

  next();
};