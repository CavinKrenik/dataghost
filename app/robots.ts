import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/success',
                '/debug-user',
                '/_next/',
            ],
        },
        sitemap: 'https://dataghost.me/sitemap.xml',
    }
}