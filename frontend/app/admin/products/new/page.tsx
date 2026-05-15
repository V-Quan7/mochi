"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  Trash2,
  PackagePlus,
  X,
  CheckCircle2
} from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  // --- BƯỚC 1: KHỞI TẠO STATE ---
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]); // Danh sách category từ Navigation

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    price: "",
    oldPrice: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    countInStock: "0",
    isFeatured: false,
  });

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Lấy danh sách danh mục để đổ vào Select
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/navigation`);
        const result = await res.json();
        setCategories(result.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCats();
  }, []);

  // --- BƯỚC 2: LOGIC XỬ LÝ SPECIFICATIONS & IMAGES ---
  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Tạo preview ảnh
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Tự động tạo Slug khi nhập tên
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, name, slug });
  };

  // --- BƯỚC 3: LOGIC SUBMIT (GỬI FORMDATA) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const data = new FormData();

      // Append các trường text
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });

      // Append specifications dưới dạng chuỗi JSON (Khớp với Controller JSON.parse)
      data.append("specifications", JSON.stringify(specs.filter(s => s.key)));

      // Append images (Khớp với req.files ở Backend)
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("Đã thêm sản phẩm thành công!");
        router.push("/admin/products");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.message || "Lỗi khi tạo sản phẩm");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PackagePlus className="text-pink-500" /> Thêm sản phẩm mới
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Thông tin cơ bản</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên sản phẩm *</label>
              <Input required value={formData.name} onChange={handleNameChange} placeholder="Nhập tên sản phẩm..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Đường dẫn (Slug)</label>
                <Input disabled value={formData.slug} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mã SKU</label>
                <Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="VD: MOCHI-001" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả ngắn</label>
              <Textarea value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Tóm tắt đặc điểm nổi bật..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả chi tiết</label>
              <Textarea rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Nội dung chi tiết sản phẩm..." />
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="font-semibold text-lg">Thông số kỹ thuật</h2>
              <Button type="button" variant="ghost" size="sm" onClick={addSpec} className="text-blue-600">
                <Plus className="h-4 w-4 mr-1" /> Thêm dòng
              </Button>
            </div>
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-3 items-center">
                <Input placeholder="Tên (VD: Chất liệu)" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} />
                <Input placeholder="Giá trị (VD: Bông mềm)" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: GIÁ, ẢNH & DANH MỤC */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Phân loại & Giá</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Danh mục *</label>
              <select
                required
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <optgroup key={cat._id} label={cat.name}>
                    <option value={cat._id}>{cat.name} (Chính)</option>
                    {cat.children?.map((child: any) => (
                      <option key={child._id} value={child._id}>-- {child.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá bán (VNĐ) *</label>
              <Input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá cũ (nếu có)</label>
              <Input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số lượng tồn kho</label>
              <Input type="number" value={formData.countInStock} onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium">Sản phẩm nổi bật</label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Hình ảnh</h2>
            <div className="grid grid-cols-2 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square border rounded-lg overflow-hidden group">
                  <img src={src} alt="preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-[10px] text-white text-center py-0.5">Ảnh chính</span>}
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                <UploadCloud className="h-6 w-6 text-slate-400" />
                <span className="text-[10px] mt-1 text-slate-500">Tải ảnh</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 text-lg bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-200">
            {loading ? "Đang xử lý..." : <><CheckCircle2 className="mr-2" /> Lưu</>}
          </Button>
        </div>
      </form>
    </div>
  );
}