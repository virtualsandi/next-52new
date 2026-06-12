'''' js
   export const metadata = {
    "title": {
        "absolute": "My page title",
        "template": "%s | Ecommerce Page"
    },
    "description": "",
    "keywords": ["value1", "value2"],
    "authors": [{"name": "Sandip Badayak"}]
    "openGraph" : {
        "title": "",
        "description": "",
        "url": "",
        "siteName": "website Name",
        "images": [
            {
                "url": "",
                "width": 1200,
                "height": 630
            }
        ],
        "locale": "en_US",
        "type": "website"
    },
    "twitter": {
        "card": "summary_large_image",  // twitter card type
        "title": "twitter title",
        "description": "Twitter Description",
        "images": ["imagesUrl]
    }
   }
   '''''''''''''

   - deployment
     -   

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
