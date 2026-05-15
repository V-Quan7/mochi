import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
// nếu đường dẫn khớp với /admin hoặc bất kỳ đường dẫn nào bắt đầu bằng /admin, thì yêu cầu phải được bảo vệ (chỉ dành cho người dùng đã đăng nhập)

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};