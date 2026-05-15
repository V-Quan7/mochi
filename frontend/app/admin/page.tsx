
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign, Package } from "lucide-react";

export default function AdminDashboard() {
  // Các con số thống kê mẫu
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "15.000.000đ",
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      description: "+20% từ tháng trước",
    },
    {
      title: "Đơn hàng",
      value: "+120",
      icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
      description: "25 đơn chờ xử lý",
    },
    {
      title: "Sản phẩm",
      value: "45",
      icon: <Package className="w-5 h-5 text-orange-600" />,
      description: "5 mẫu sắp hết hàng",
    },
    {
      title: "Khách hàng",
      value: "350",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      description: "12 người mới hôm nay",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Chào mừng sếp quay trở lại hệ thống quản trị.</p>
      </div>
      
      {/* Các thẻ thống kê nhanh */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Khu vực danh sách đơn hàng mới (Sẽ code ở bước 6) */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Đơn hàng mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              Dữ liệu đơn hàng sẽ hiển thị tại đây
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}