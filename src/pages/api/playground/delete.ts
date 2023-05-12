import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function deletePlayground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playgroundId} = req.body


  const playground = await prisma.playground.delete({
    where: {
      id: playgroundId
    },
  })
  res.json(playground)
}
