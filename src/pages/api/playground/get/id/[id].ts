import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { id } = req.query
  try {
    const playground = await prisma.playground.findFirst({
      where: {
        id: id as string,
      },
    })
    res.status(200).json(playground)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error getting playgrounds' })
  } finally {
    await prisma.$disconnect()
  }
}
