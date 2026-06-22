import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.TMDB_API_KEY
  const { id } = req.query
  const type = req.query.type || 'movie'

  const [details, credits, videos, similar] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}`).then(r => r.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${apiKey}`).then(r => r.json()),
  ])

  const trailer = videos.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')

  res.json({
    ...details,
    cast: credits.cast?.slice(0, 10) || [],
    similar: similar.results?.slice(0, 10) || [],
    trailer_key: trailer?.key || null,
  })
}