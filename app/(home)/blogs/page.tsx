export default function BlogPage() {
  const blogs = [
    {
      id: 1,
      title: "Top 10 Fashion Trends for 2026",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      category: "Fashion",
      date: "June 10, 2026",
      excerpt:
        "Discover the latest fashion trends that are dominating the market this year.",
    },
    {
      id: 2,
      title: "How to Choose the Perfect Smartphone",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      category: "Electronics",
      date: "June 08, 2026",
      excerpt:
        "A complete buying guide to help you find the right smartphone for your needs.",
    },
    {
      id: 3,
      title: "Home Decor Ideas That Transform Your Space",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
      category: "Home & Living",
      date: "June 05, 2026",
      excerpt:
        "Simple and affordable home decor ideas to make your home look premium.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Blog Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              E-Commerce Blog
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-200">
              Insights, shopping guides, product reviews, and industry trends.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              alt="Featured Blog"
              className="h-full w-full object-cover"
            />

            <div className="p-8 flex flex-col justify-center">
              <span className="text-sm font-medium text-blue-600">
                Featured Article
              </span>

              <h2 className="text-3xl font-bold mt-3 mb-4">
                The Ultimate Guide to Smart Shopping Online
              </h2>

              <p className="text-gray-600 mb-6">
                Learn how to compare products, identify genuine discounts,
                and make smarter purchasing decisions.
              </p>

              <button className="w-fit rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Latest Articles</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
                  <span>{blog.category}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                </div>

                <h3 className="mb-3 text-xl font-semibold">
                  {blog.title}
                </h3>

                <p className="mb-5 text-gray-600">
                  {blog.excerpt}
                </p>

                <button className="font-medium text-blue-600 hover:text-blue-800">
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}