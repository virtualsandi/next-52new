import Link from "next/link";

export default async function ProductsPage() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/product",
    {
      cache: "no-store",
    }
  );

  const result = await response.json();
  const products = result.data || [];

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-center text-4xl font-bold">
        All Products
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-lg"
          >
            <Link href={`/product/${product.slug}`}>
              <img
                src={
                  process.env.NEXT_PUBLIC_ASSETS_URL +
                  product.images?.[0]
                }
                alt={product.name}
                className="h-56 w-full object-cover"
              />
            </Link>

            <div className="p-4">
              <Link href={`/product/${product.slug}`}>
                <h2 className="line-clamp-2 text-lg font-semibold hover:text-teal-600">
                  {product.name}
                </h2>
              </Link>

              <p className="mt-2 text-xl font-bold text-green-600">
                Npr. {product.price?.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {product.brand?.name}
              </p>

              <p className="text-sm text-gray-500">
                {product.category?.name}
              </p>

              <Link
                href={`/product/${product.slug}`}
                className="mt-4 inline-block rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}