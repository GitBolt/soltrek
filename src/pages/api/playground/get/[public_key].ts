import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { public_key } = req.query

  const user = await prisma.user.findFirst({
    where: {
      publicKey: public_key as string,
    } as Prisma.UserWhereUniqueInput,
  })

  if (!user) return
  try {
    const playgrounds = await prisma.playground.findMany({
      where: {
        userId: Number(user.id),
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json({ playgrounds })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error getting playgrounds' })
  } finally {
    await prisma.$disconnect()
  }
}
