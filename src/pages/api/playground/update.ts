import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function createPlayground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playgroundId, name, data, preview_uri} = req.body


  const playground = await prisma.playground.update({
    where: {
      id: playgroundId
    },
    data: {
      name,
      data,
      preview_url: preview_uri,
    },
  })
  res.json(playground)
}
