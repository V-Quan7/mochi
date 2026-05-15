"use client";
import { Search, User, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

import { INavigation, INavigationChild } from "@/types/index";
import { getNavigation } from "@/services/navigationService";

export default function Header() {
    const [navigation, setNavigation] = useState<INavigation[]>([]);
    const { isSignedIn } = useUser();

    useEffect(() => {

        const fetchNavigation = async () => {

            try {

                const data = await getNavigation();

                setNavigation(data);

            } catch (error) {

                console.error("Error fetching navigation:", error);

            }

        };

        fetchNavigation();

    }, []);
    return (
        <header className="bg-bgMain shadow-sm ">
            <div className="container mx-auto flex items-center justify-between py-3">
                <div>
                    <h1 className="text-3xl font-bold text-[#FF6B9D]">
                        Mochi
                    </h1>

                    <p className="text-sm text-[#6B4F4F]">
                        Cute things for you
                    </p>

                </div>

                {/* SEARCH */}
                <div className="flex-1 flex justify-center mx-4 md:mx-10">
                    <div className="relative w-full max-w-[650px]">
                        <input
                            type="text"
                            placeholder="Bạn tìm gì hôm nay?"

                            className="w-full border border-pink-200 bg-white rounded-full px-6 py-1.5 
                       outline-none focus:border-primary transition-all
                       placeholder:text-gray-400 text-brown"
                        />
                        {/* Bạn có thể thêm icon kính lúp ở đây nếu muốn */}
                        <Search size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400" />
                    </div>
                </div>

                {/* ACTION */}
                <div className="flex items-center gap-5">
                    {!isSignedIn ? (
                        <Link href="/sign-in">
                            <User
                                size={25}
                                className="hover:text-blue-500 transition-colors"
                            />
                        </Link>
                    ) : (
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-9 h-9",
                                },
                            }}
                        />
                    )}
                    <ShoppingCart size={25} />
                </div>
            </div>
            <div className="flex gap-15 py-3 pt-0 justify-center text-sm">
                {navigation.map((nav) => (
                    <div
                        key={nav._id}
                        className="relative group"
                    >
                        {/* MENU */}
                        <div className="flex items-center gap-1 cursor-pointer">
                            <Link
                                href={nav.slug || "#"}
                                className="text-[#6B4F4F] hover:text-pink-500 duration-300 font-medium"
                            >
                                {nav.name}
                            </Link>
                            {/* CHỈ HIỆN ICON KHI CÓ CHILDREN */}
                            {nav.children && nav.children.length > 0 && (

                                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            )}
                        </div>

                        {/* DROPDOWN */}
                        {nav.children && nav.children.length > 0 && (

                            <div className="absolute top-full left-0 bg-white shadow-xl rounded-2xl p-5 hidden group-hover:block min-w-[220px] z-50">

                                <div className="space-y-3">

                                    {nav.children.map((child: INavigationChild) => (

                                        <Link
                                            key={child._id}
                                            href={child.slug || "#"}
                                            className="block text-[#6B4F4F] hover:text-pink-500 duration-300"
                                        >
                                            {child.name}
                                        </Link>

                                    ))}

                                </div>

                            </div>

                        )}

                    </div>

                ))}

            </div>
        </header>
    )
}
