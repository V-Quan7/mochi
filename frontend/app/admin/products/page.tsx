"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Plus, Trash2, Edit, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { getToken } = useAuth();

    // 1. Lấy danh sách sản phẩm và danh mục để lọc
    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products?search=${search}`
                ),

                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/navigation`
                )
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            setProducts(prodData.products);
            setCategories(catData.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchData(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // 2. Hàm xóa sản phẩm
    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        const token = await getToken();
        await fetch(`http://localhost:5002/api/products/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Package /> Quản lý sản phẩm ({products.length})
                </h1>
                <Button onClick={() => window.location.href = "/admin/products/new"}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
                </Button>
            </div>

            {/* Bộ lọc */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm tên sản phẩm..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select onValueChange={(val) => console.log(val)}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat: any) => (
                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Bảng sản phẩm */}
            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[80px]">Ảnh</TableHead>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Kho</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10">Đang tải...</TableCell></TableRow>
                        ) : products.map((item: any) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md border" />
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{item.name}</span>
                                        <span className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.categoryId?.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-blue-600 font-bold">{item.price?.toLocaleString()}đ</span>
                                        {item.oldPrice && <span className="text-xs line-through text-gray-400">{item.oldPrice.toLocaleString()}đ</span>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={item.countInStock < 5 ? "text-red-500 font-bold" : ""}>
                                        {item.countInStock}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {item.active ? <Badge className="bg-green-500">Đang bán</Badge> : <Badge variant="secondary">Ẩn</Badge>}
                                </TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}