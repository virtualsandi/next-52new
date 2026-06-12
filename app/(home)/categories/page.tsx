import Link from "next/link";

export default async function CategoryPage() {
    const response = await fetch (
        process.env.NEXT_PUBLIC_API_URL + "/category",
        {
            cache: "no-store",
        }
    );
    const result = await response.json();
    const categories = result.data;
    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="mb-8 text-center text-4xl font-bold">
                Categories
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category: any) => (
                    <Link 
                    key = {category._id}
                    href={`/category/${category.slug}`}
                    className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-lg">
                        <div className="h-56 overflow-hidden">

                            <img
                            src={
                                category.icon ? 
                                process.env.NEXT_PUBLIC_ASSETS_URL + category.icon 
                                : "/no-image-png"
                            }
                            alt={category.name}
                            className="h-full w-full object-cover" />

                        </div>
                        <div className="p-4 text-center">
                            <h2 className="text-xl font-semibold">
                                {category.name}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    )
}