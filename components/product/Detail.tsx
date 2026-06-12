'use client'

import PageEdit from "./PageEdit";

export default function ProductDetail({ detail }: any) {
  if (!detail) {
    return <div>Product not found</div>;
  }

  return <PageEdit detail={detail} />;
}