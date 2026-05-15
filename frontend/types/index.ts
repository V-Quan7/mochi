
import { Truck, RefreshCcw, ShieldCheck, Headphones, } from "lucide-react";

export const features = [
    {
        id: 1,
        title: "Miễn phí vận chuyển",
        description: "Cho đơn từ 300k",
        icon: Truck,
        color: "text-pink-500",
        bg: "bg-pink-100",
    },
    {
        id: 2,
        title: "Đổi trả dễ dàng",
        description: "Trong vòng 7 ngày",
        icon: RefreshCcw,
        color: "text-green-500",
        bg: "bg-green-100",
    },
    {
        id: 3,
        title: "Thanh toán an toàn",
        description: "Bảo mật tuyệt đối",
        icon: ShieldCheck,
        color: "text-blue-500",
        bg: "bg-blue-100",
    },
    {
        id: 4,
        title: "Hỗ trợ 24/7",
        description: "Luôn sẵn sàng hỗ trợ",
        icon: Headphones,
        color: "text-purple-500",
        bg: "bg-purple-100",
    },
];

export interface INavigationChild {
    _id?: string;
    name: string;
    slug: string;
    icon?: string;
    order?: number;
}

export interface INavigation {
    _id?: string;
    name: string;
    slug: string;
    icon?: string;
    order?: number;
    active?: boolean;
    children?: INavigationChild[];
    createdAt?: string;
    updatedAt?: string;
}
export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number;
    discount: number;
    image: string;
    images: string[];
    shortDescription?: string;
    description?: string;
    specifications: { key: string; value: string }[];
    countInStock: number;
    rating: number;
    numReviews: number;
    categoryId: any;
}