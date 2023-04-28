import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function createUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { publicKey } = req.body
  const user = await prisma.user.create({
    data: {
      publicKey,
    },
  })
  res.json(user)
}
