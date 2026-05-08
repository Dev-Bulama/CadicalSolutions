// app/robots.ts

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'ClaudeBot',
          'anthropic-ai',
          'CCBot',
          'Bytespider',
          'PerplexityBot',
        ],
        allow: '/',
        disallow: ['/*'],
      },
    ],
  }
}