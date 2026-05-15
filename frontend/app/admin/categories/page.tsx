"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, ChevronRight, ChevronDown, ListTree, Edit3 } from "lucide-react";

export default function NavigationPage() {
  const { getToken } = useAuth();
  const [menus, setMenus] = useState<any[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // State cho thêm mới
  const [newMenu, setNewMenu] = useState({ name: "", slug: "", icon: "Circle" });
  const [childMenu, setChildMenu] = useState({ name: "", slug: "", icon: "Circle" });

  // State cho chỉnh sửa (Update)
  const [editingMenu, setEditingMenu] = useState<any>(null);

  const [selectedParentId, setSelectedParentId] = useState("");
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/navigation`;

  const fetchMenus = async () => {
    try {
      const res = await fetch(API_URL);
      const result = await res.json();
      setMenus(result.data || []);
    } catch (error) {
      toast.error("Lỗi lấy dữ liệu");
    }
  };

  useEffect(() => { fetchMenus(); }, []);

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- LOGIC THÊM MENU CHA ---
  const handleAddParent = async () => {
    if (!newMenu.name || !newMenu.slug) return toast.error("Vui lòng nhập đủ thông tin");
    try {
      const token = await getToken();
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newMenu),
      });
      if (res.ok) {
        toast.success("Thêm menu cha thành công");
        setNewMenu({ name: "", slug: "", icon: "Circle" });
        setIsAddParentOpen(false);
        fetchMenus();
      }
    } catch (error) { toast.error("Lỗi thêm cha"); }
  };

  // --- LOGIC THÊM MENU CON ---
  const handleAddChild = async () => {
    if (!selectedParentId || !childMenu.name || !childMenu.slug) return toast.error("Vui lòng nhập đủ thông tin");
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/${selectedParentId}/add-child`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(childMenu),
      });
      if (res.ok) {
        toast.success("Thêm menu con thành công");
        setChildMenu({ name: "", slug: "", icon: "Circle" });
        setIsAddChildOpen(false);
        fetchMenus();
      }
    } catch (error) { toast.error("Lỗi thêm con"); }
  };

  // --- LOGIC CẬP NHẬT (UPDATE) ---
  const handleUpdate = async () => {
    if (!editingMenu?._id) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/${editingMenu._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: editingMenu.name,
          slug: editingMenu.slug,
          icon: editingMenu.icon
        }),
      });
      if (res.ok) {
        toast.success("Cập nhật thành công");
        setIsUpdateOpen(false);
        fetchMenus();
      }
    } catch (error) { toast.error("Lỗi cập nhật"); }
  };

  // --- LOGIC XÓA ---
  const handleDelete = async (id: string) => {
    if (!confirm("Xóa menu này?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Đã xóa thành công");
        fetchMenus();
      }
    } catch (error) { toast.error("Lỗi khi xóa"); }
  };

  return (
    <div className="space-y-6 p-4">
      {/* TIÊU ĐỀ VÀ NÚT THÊM CHA Ở GÓC PHẢI */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ListTree className="text-blue-500" /> Quản lý Menu
        </h1>

        <Dialog open={isAddParentOpen} onOpenChange={setIsAddParentOpen}>
          <DialogTrigger>
            <Button className="rounded-full shadow-md"><Plus className="mr-2 h-4 w-4" /> Thêm Menu Cha</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Thêm Menu Cha Mới</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Tên menu" value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} />
              <Input placeholder="Slug (ví dụ: san-pham)" value={newMenu.slug} onChange={(e) => setNewMenu({ ...newMenu, slug: e.target.value })} />
              <Input placeholder="Icon (Lucide Icon name)" value={newMenu.icon} onChange={(e) => setNewMenu({ ...newMenu, icon: e.target.value })} />
              <Button className="w-full" onClick={handleAddParent}>Tạo Menu Cha</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Tên Menu</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu: any) => {
              const isOpen = openMenus.includes(menu._id);
              return (
                <React.Fragment key={menu._id}>
                  <TableRow className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold cursor-pointer" onClick={() => toggleMenu(menu._id)}>
                      <div className="flex items-center gap-2">
                        {menu.children?.length > 0 ? (
                          isOpen ? <ChevronDown size={18} className="text-blue-500" /> : <ChevronRight size={18} />
                        ) : <span className="w-[18px]" />}
                        {menu.name}
                      </div>
                    </TableCell>
                    <TableCell>{menu.slug}</TableCell>
                    <TableCell><span className="text-xs bg-slate-100 px-2 py-1 rounded">{menu.icon}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">

                        {/* NÚT THÊM CON */}
                        <Button variant="outline" size="sm" onClick={() => { setSelectedParentId(menu._id); setIsAddChildOpen(true); }}>
                          <Plus className="mr-1 h-3 w-3" /> Con
                        </Button>

                        {/* NÚT SỬA */}
                        <Button variant="ghost" size="icon" onClick={() => { setEditingMenu(menu); setIsUpdateOpen(true); }}>
                          <Edit3 className="h-4 w-4 text-blue-600" />
                        </Button>

                        {/* NÚT XÓA */}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(menu._id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* DANH SÁCH CON */}
                  {isOpen && menu.children?.map((child: any) => (
                    <TableRow key={child._id} className="bg-slate-50/40">
                      <TableCell className="pl-10 text-sm text-gray-600 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-300" /> {child.name}
                      </TableCell>
                      <TableCell className="text-sm italic text-gray-400">{child.slug}</TableCell>
                      <TableCell className="text-sm text-gray-400">{child.icon}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingMenu(child); setIsUpdateOpen(true); }}>
                          <Edit3 className="h-3 w-3 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(child._id)}>
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* DIALOG THÊM CON */}
      <Dialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Thêm menu con</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input placeholder="Tên" value={childMenu.name} onChange={(e) => setChildMenu({ ...childMenu, name: e.target.value })} />
            <Input placeholder="Slug" value={childMenu.slug} onChange={(e) => setChildMenu({ ...childMenu, slug: e.target.value })} />
            <Input placeholder="Icon" value={childMenu.icon} onChange={(e) => setChildMenu({ ...childMenu, icon: e.target.value })} />
            <Button className="w-full" onClick={handleAddChild}>Lưu Menu Con</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG CHỈNH SỬA (UPDATE) */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chỉnh sửa: {editingMenu?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên hiển thị</label>
              <Input value={editingMenu?.name || ""} onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đường dẫn (Slug)</label>
              <Input value={editingMenu?.slug || ""} onChange={(e) => setEditingMenu({ ...editingMenu, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Icon</label>
              <Input value={editingMenu?.icon || ""} onChange={(e) => setEditingMenu({ ...editingMenu, icon: e.target.value })} />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>Cập nhật thay đổi</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}