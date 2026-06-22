import { Metadata } from "next";
import HeroBanner from "@/components/banner/Hero";
import Link from "next/link";
export async function generateMetadata (): Promise<Metadata>{
  return {
    title: "Home Page",
    description: "",
    openGraph: {
      title: "",
      url: "",
      description:"",
      images:[""]
    },
  } as Metadata;
};

interface IProduct {
  afterDiscount: number,
  brand: {
    _id: string,
    name: string,
    slug: string,
    logo: string
  }
  category: {
    _id:string, name:string, slug:string
  }
  createdAt: Date
  createdBy: null,
  description: string,
  discount: number,
  images: Array<string>,
  name: string,
  price: number,
  seller: {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address: string
  }
  slug: string,
  status: string,
  updatedAt: Date,
  updatedBy: string,
  _id: string
}
export default async function Home() {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/products?page=1&limit=15' ,{
    method:"GET",
  });
    let data;
  if(response.ok){
     data = await response.json()

  }
  return (<>
  
<HeroBanner />

<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div className="text-center">
      <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"></path>
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">High perhtmlFormance</h3>

      <p className="mt-2 text-pretty text-gray-700">Optimized load times</p>
    </div>

    <div className="text-center">
      <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path>
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">Enterprise security</h3>

      <p className="mt-2 text-pretty text-gray-700">Every layer secured</p>
    </div>

    <div className="text-center">
      <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"></path>
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">Highly configurable</h3>

      <p className="mt-2 text-pretty text-gray-700">Adapt every aspect</p>
    </div>

    <div className="text-center">
      <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"></path>
        </svg>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">Advanced reporting</h3>

      <p className="mt-2 text-pretty text-gray-700">Metrics that matter</p>
    </div>
  </div>
</div>

{/** Product List Grid Starts/ */}
<section className="bg-gray-50 py-8 antialiasedd:py-12">
  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    
    <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
      <div>
        
        <h2 className="mt-3 text-xl font-semibold text-gray-900  sm:text-2xl">For You !!!!</h2>
      </div>
      <div className="flex items-center space-x-4">
        
      </div>
    </div>

   {/** Product grid */}
    <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
     {
      Array.isArray(data) && data.map((prod: IProduct, i: number) => (
         <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm  ">
        <div className="h-56 w-full">
          <Link href={'/products/'+prod.slug}>
            <img 
            className="mx-auto h-full " 
            src={process.env.NEXT_PUBLIC_ASSETS_URL+prod.images[0]} 
            crossOrigin="anonymous"
            alt="" />
            
          </Link>
        </div>
        <div className="pt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
           {
            prod.discount && prod.discount > 0 ? <>
             <span className="me-2 rounded bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800  "> 
              {" "}
              Up to {prod.discount}% off {" "}
              
              </span>
            </> : <></>
           }

            <div className="flex items-center justify-end gap-1">
              
              

              <button type="button" data-tooltip-target="tooltip-add-to-favorites" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900  ">
                <span className="sr-only"> Add to Favorites </span>
                
              </button>
              <div id="tooltip-add-to-favorites" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 " data-popper-placement="top">
                Add to favorites
                <div className="tooltip-arrow" data-popper-arrow=""></div>
              </div>
            </div>
          </div>

          <Link 
          href={'/products/'+prod.slug}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline ">
          {prod.name}
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>

              <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>

              <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>

              <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>

              <svg className="h-4 w-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
              </svg>
            </div>

            <p className="text-sm font-medium text-gray-900 ">5.0</p>
            <p className="text-sm font-medium text-gray-500 ">(455)</p>
          </div>

          <ul className="mt-2 flex items-center gap-4">
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
              </svg>
              <p className="text-sm font-medium text-gray-500 ">Fast Delivery</p>
            </li>

            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M8 7V6c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-1M3 18v-7c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
              <p className="text-sm font-medium text-gray-500 ">Best Price</p>
            </li>
          </ul>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p 
            className="text-2xl font-extrabold leading-tight text-gray-900 ">
              Npr. {prod.afterDiscount}
              </p>

            <button type="button" className="inline-flex items-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-4  focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
              <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
              </svg>
              Add to cart
            </button>
          </div>
        </div>
      </div>
      ))
     }
     
    </div>
   {/** Product grid */}
    
    <div className="w-full text-center">
      <Link 
      href="/products"
      type="/button" className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-teal-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100   ">
        Show more
        </Link>
    </div>
  </div>
  
 
</section>
{/** Product List Grid ends here/ */}


</>
  );
}
