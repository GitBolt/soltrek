import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export default async function getUserByPublicKey(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key } = req.query

  const user = await prisma.user.findFirst({
    where: {
      publicKey: public_key as string,
    } as Prisma.UserWhereUniqueInput,
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user)
}
