export default function PageEdit ({detail}: any) {

    
    return(<>
    

    <div className="container mx-auto gap-6">
  <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-8  ">

    {/* Left Side - Image */}
    <div>
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
  <img
    src={process.env.NEXT_PUBLIC_ASSETS_URL + detail.images[0]}
    alt={detail.name}
    className="max-h-[400px] object-contain"
  />
</div>
    </div>

    {/* Right Side - Product Details */}
    <div className="bg-gray-50 rounded-lg border p-6 shadow-sm">
      <h1 className="mb-4 text-3xl font-bold">
        {detail.name}
      </h1>

      {detail.price && (
        <div className="mb-4 text-2xl font-semibold text-green-600">
          Npr. {detail.price}
        </div>
      )}

      {detail.brand && (
        <p className="mb-2">
          <strong>Brand:</strong> {detail.brand?.name}
        </p>
      )}

      {detail.category && (
        <p className="mb-2">
          <strong>Category:</strong> {detail.category?.name}
        </p>
      )}

      {detail.description && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">
            Description
          </h2>
          <p>{detail.description}</p>


          <div className="mt-6 flex items-center justify-between">
  <div className="text-2xl font-semibold text-black-600">
    
    Npr. {detail.price}
    
  </div>

  <button
    type="button"
    className="inline-flex items-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-4  focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
  >
    <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
              </svg>
    Add to Cart
    
  </button>
</div>
        </div>
        
      )}
      
    </div>

  </div>
</div>
        
        
    
    
    </>)
   
}