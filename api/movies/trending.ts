import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.TMDB_API_KEY
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`)
  const data = await response.json()
  res.json(data)
}