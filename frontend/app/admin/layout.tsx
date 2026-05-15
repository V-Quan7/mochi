import Link from "next/link";
import { LayoutDashboard, Package, ListTree, ShoppingCart, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Sản phẩm", href: "/admin/products", icon: <Package size={20} /> },
    { name: "Danh mục", href: "/admin/categories", icon: <ListTree size={20} /> },
    { name: "Đơn hàng", href: "/admin/orders", icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className="flex min-h-screen border-t">
      {/* Sidebar bên trái */}
      <aside className="w-64 border-r bg-slate-50/50 p-6">
        <div className="mb-8 font-bold text-xl text-blue-600">MOCHI ADMIN</div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all">
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t">
             <Link href="/" className="flex items-center gap-3 p-2 text-gray-500">
                <Home size={20} />
                <span className="text-sm">Về trang chủ Shop</span>
             </Link>
          </div>
        </nav>
      </aside>

      {/* Nội dung chính bên phải */}
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
  );
}