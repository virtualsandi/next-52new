    export default function AboutUsPage() {
  return(
    <div className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Welcome to our online store. We are committed to providing
          high-quality products, exceptional customer service, and a
          seamless shopping experience for our customers.
        </p>
      </div>

      {/* Company Story */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
            alt="About Us"
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded with a vision to make online shopping simple and
            reliable, we have grown into a trusted destination for
            customers looking for quality products at competitive prices.
          </p>

          <p className="text-gray-600">
            Our team works hard every day to ensure that customers
            receive the best products, secure payments, and fast
            delivery services.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
          <p className="text-gray-600">
            To provide customers with high-quality products, affordable
            prices, and an enjoyable shopping experience.
          </p>
        </div>

        <div className="rounded-lg border p-6 shadow-sm">
          <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
          <p className="text-gray-600">
            To become one of the most trusted e-commerce platforms by
            delivering value, innovation, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-3xl font-bold text-teal-600">10K+</h3>
          <p>Customers</p>
        </div>

        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-3xl font-bold text-teal-600">5K+</h3>
          <p>Products</p>
        </div>

        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-3xl font-bold text-teal-600">99%</h3>
          <p>Customer Satisfaction</p>
        </div>

        <div className="rounded-lg border p-6 text-center">
          <h3 className="text-3xl font-bold text-teal-600">24/7</h3>
          <p>Support</p>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Team
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
         < div className="rounded-lg border bg-gray-100 p-6 text-center">
            <img
              src="https://scontent.cdninstagram.com/v/t51.82787-19/684516156_18021945596820672_6171945371046550924_n.jpg?_nc_cat=101&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=xIzzuiJqBOsQ7kNvwG12X8q&_nc_oc=AdpbKUZyIreKiY89Ibiv54qcOFMUQUiJOJt71eG5McuR7AFPPX8QPCyFRXb3KEgiwLw&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=LtrGHQVnc8xAeJaYNezGnQ&_nc_ss=7b6a8&oh=00_Af85AY3TNnc38xdnwEgCwcxeXWiSy327WJHb-jDps4JSJQ&oe=6A2CB1FB"
              alt="Team Member"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="font-bold">XXX Bist</h3>
            <p className="text-gray-500">Founder & CEO</p>
          </div>

          <div className="rounded-lg border p-6 text-center">
            <img
              src="https://scontent.fdel11-2.fna.fbcdn.net/v/t39.30808-6/291041942_995853598037902_153129389738838464_n.jpg?stp=dst-jpg_tt6&cstp=mx1500x1000&ctp=s1500x1000&_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=bHG70VYEfnUQ7kNvwGOrA4z&_nc_oc=Adpy0D_OuUWvZCg1t04LXwXxX3ZG18cB2vHMjEXi-8swA_Z3zZI6C9nc6JnIaYyMJFs&_nc_zt=23&_nc_ht=scontent.fdel11-2.fna&_nc_gid=OFecOm4jHA5wIFherPk1Cw&_nc_ss=7b2a8&oh=00_Af-RoQnN-evzmG7wENV0KV4d8JuIM902doo5O2Wyc2J-_w&oe=6A2C9618"
              alt="Team Member"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="font-bold">XXX Awasthi</h3>
            <p className="text-gray-500">Marketing Head</p>
          </div>

          <div className="rounded-lg border p-6 text-center">
            <img
              src="https://scontent.fdel11-1.fna.fbcdn.net/v/t39.30808-1/671643876_2007754100141179_1419832333101135782_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x2041&ctp=s200x200&_nc_cat=110&ccb=1-7&_nc_sid=1d2534&_nc_ohc=RhF7p8Aa4EEQ7kNvwFCRvfl&_nc_oc=Adrv49oZZbP2Mbby3kcRdUty21p5THa2qqg-Rkt2Ie-BqP52ddoy5XReKJDG_TWrE_8&_nc_zt=24&_nc_ht=scontent.fdel11-1.fna&_nc_gid=jmHW6p_FGS7rWJJBFmk0Xg&_nc_ss=7b2a8&oh=00_Af892wq5ykZwIPvYUnJMQKZCzBFlkJCXl0JgkNUKvoE17A&oe=6A2C9308"
              alt="Team Member"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="font-bold">XXX Bhattrai</h3>
            <p className="text-gray-500">Operations Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
