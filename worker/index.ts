interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
}

const DISCOVERY_LINKS = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</index.md>; rel="alternate"; type="text/markdown"',
].join(', ')

const CONTENT_SIGNAL = 'ai-train=no, search=yes, ai-input=yes, use=reference'

function acceptsMarkdown(request: Request): boolean {
  return request.headers
    .get('Accept')
    ?.split(',')
    .some((value) => {
      const [mediaType, ...parameters] = value.trim().split(';')
      if (mediaType.toLowerCase() !== 'text/markdown') return false
      const quality = parameters.find((parameter) => parameter.trim().startsWith('q='))
      return !quality || Number(quality.trim().slice(2)) > 0
    }) ?? false
}

function withDiscoveryHeaders(response: Response, markdown: boolean): Response {
  const headers = new Headers(response.headers)
  headers.set('Content-Signal', CONTENT_SIGNAL)
  headers.set('Link', DISCOVERY_LINKS)
  const vary = headers.get('Vary')
  if (!vary?.split(',').some((value) => value.trim().toLowerCase() === 'accept')) {
    headers.set('Vary', vary ? `${vary}, Accept` : 'Accept')
  }
  if (markdown) headers.set('Content-Type', 'text/markdown; charset=utf-8')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const isHomepage = url.pathname === '/' || url.pathname === '/index.html'

    if (isHomepage && (url.hostname === 'www.marban.lol' || url.hostname === 'marban.is-a.dev')) {
      url.protocol = 'https:'
      url.hostname = 'marban.lol'
      url.pathname = '/'
      return Response.redirect(url, 308)
    }

    if (isHomepage && acceptsMarkdown(request)) {
      const markdownUrl = new URL('/index.md', url)
      const markdownRequest = new Request(markdownUrl, request)
      return withDiscoveryHeaders(await env.ASSETS.fetch(markdownRequest), true)
    }

    return withDiscoveryHeaders(await env.ASSETS.fetch(request), false)
  },
}
