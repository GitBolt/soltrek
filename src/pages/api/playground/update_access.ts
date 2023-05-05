

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'


export default async function createPlayground(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playgroundId, new_wallet } = req.body


  const playground = await prisma.playground.update({
    where: {
      id: playgroundId
    },
    data: {
      edit_access: { push: new_wallet }
    }
  })

  res.json(playground)
}
