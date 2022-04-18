import type { NextApiRequest, NextApiResponse } from 'next'

import { getDownloadUrl } from '@/utils/file'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ url: string } | { message: string }>
) {
  try {
    const key = req.query.key
    if (Array.isArray(key)) {
      return res.status(400).json({ message: 'SEM_QUERY_NOT_ALLOWED' })
    }

    switch (req?.method) {
      case 'GET': {
        const url = await getDownloadUrl(key, {
          bucket: process.env.AWS_BUCKET_NAME,
          region: process.env.AWS_BUCKET_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY
        })

        return res.status(200).json({ url })
      }

      default:
        return res.status(405).json({ message: 'SEM_METHOD_NOT_ALLOWED' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'SEM_UNEXPECTED_ERROR' })
  }
}