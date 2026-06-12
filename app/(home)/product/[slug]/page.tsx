import ProductDetail from "@/components/product/Detail";
import { Metadata } from "next";
type metaProps = {
    params: {
        slug: string
    }
}
export async function generateMetadata({params}:metaProps): Promise<Metadata> {
  const {slug} = await params
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/product/"+slug);
  
  
  const detail = await response.json()
  
  return {
    title: detail.data.name,
    description: detail.data.name,
    openGraph: {
        title: detail.data.name,
        description: detail.data.name,
        images: [process.env.NEXT_PUBLIC_ASSETS_URL+detail.data.images[0]]
    }
}
}
export default async function ProductDetailPage({params}: metaProps) {
 const {slug} = await params;
    // params
const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/product/'+ slug);
const detail = await response.json()
    return(<>
    <div className="h-screen">
  {/* <ProductDetail detail={detail}/> */}
<ProductDetail detail= {detail.data} />
    </div>
    </>)
}