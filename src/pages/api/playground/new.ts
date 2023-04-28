import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function createPlayground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, name, data } = req.body
  const playground = await prisma.playground.create({
    data: {
      name,
      data,
      userId: parseInt(userId),
    },
  })
  res.json(playground)
}
