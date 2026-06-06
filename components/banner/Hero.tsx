'use client';

import axiosInstance from "@/config/axios.config";
import Image from "next/image"
import { useEffect, useState } from "react";
import { toast } from "sonner";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';


interface IBanner {
  createdAt: Date;
  image: string;
  link: string;
  status: string;
  updatedAt: Date;
  _id: string;
}

export default function HeroBanner() {
    const [banner, setBanner] = useState<Array<IBanner>>([])
    const getAllBanners = async () => {
      try {
        const response = await axiosInstance.get("/banner/", {params: {status: 'active', limit: 5}})
        setBanner(response.data)
      } catch(exception) {
        toast.error("Error while fetching data")
      }
    }
    

    useEffect (() => {
    // api call
    getAllBanners()
    },[])
    return(<>
    {/** hero section */}
    <section className="bg-teal-50 lg:grid lg:place-content-center">
      <div className="mx-auto w-screen max-w-7xl py-16 sm: py-24  md:items-center md:gap-4 lg:px-8 lg:py-32">
        <Swiper
        modules={[Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      className="w-full"
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={(swiper) => console.log(swiper)}
    >
    {
      banner && banner.map((row) => <SwiperSlide key={row._id}> 
      <img src ={process.env.NEXT_PUBLIC_ASSETS_URL+row.image}  className="w-full " alt="" crossOrigin="anonymous"/> 
      {/* <Image src={process.env.NEXT_PUBLIC_ASSETS_URL+row.image} width={1200} height={400} className="w-full h-auto" alt="" crossOrigin="anonymous"/> */}
      
      
      </SwiperSlide>)
    }
     
    </Swiper>
      </div>
    </section>
    {/** hero section */}
    </>)
} 