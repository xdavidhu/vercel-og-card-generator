import { ImageResponse } from '@vercel/og'
import { ImageResponseOptions, NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

const font = fetch(new URL('../../assets/EBGaramond-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
)

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fontData = await font

    let title: string
    const raw_title = searchParams.get('title')
    if (raw_title && raw_title.trim() !== 'notes.xdavidhu.me') {
      title = raw_title.trim()

      const max_length = 70
      if (title.length > max_length) {
        title = title.substring(0, max_length)
        title = title.substring(0, Math.min(title.length, title.lastIndexOf(" "))) + '\u2026'
      }
    }

    const imageResponseOptions: ImageResponseOptions = {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'EB Garamond',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }

    return (title ? new ImageResponse(
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#f6eee3',
        fontFamily: 'EB Garamond',
        padding: 50,
      }}>
        <div style={{ fontSize: 55 }}>notes.xdavidhu.me</div>
        <div style={{
          fontSize: 95,
          marginTop: 25,
          textAlign: 'left',
          lineHeight: '83%',
        }}>
          {title}
        </div>
      </div>, imageResponseOptions
    ) : new ImageResponse(
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6eee3',
        fontFamily: 'EB Garamond'
      }}>
        <div style={{ fontWeight: 700, fontSize: 110 }}>notes.xdavidhu.me</div>
      </div>, imageResponseOptions
    ))
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
