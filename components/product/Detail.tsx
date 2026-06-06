'use client'

import axiosInstance from "@/config/axios.config"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductDetail ({detail})  {
    // params
    // const [detail, setDetail] = useState()
    const params = useParams()
    const getProductDetail = async() => {
        // api call
        // const response =await axiosInstance.get('/product/'+params.slug)
        // console.log(response)
    }

    useEffect(() => {
        getProductDetail()
    },[])
    return(<>
    {params.slug}
    
    </>)
}