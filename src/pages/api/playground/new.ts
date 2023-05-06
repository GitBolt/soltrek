import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function createPlayground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, name, data, preview_uri, multiplayer } = req.body

  console.log(req.body)
  const playground = await prisma.playground.create({
    data: {
      name,
      data,
      multiplayer,
      preview_url: preview_uri,
      userId: userId,
    },
  })
  res.json(playground)
}
