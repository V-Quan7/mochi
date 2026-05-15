export const getNavigation = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/navigation`);
    const data = await res.json();
    return data.data;
}   