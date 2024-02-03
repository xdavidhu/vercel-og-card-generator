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

    const hasTitle = searchParams.has('title') && searchParams.get('title').trim().length > 0
    const title = searchParams.get('title')?.slice(0, 200)
    
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

    return (hasTitle ? new ImageResponse(
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
        <div style={{ fontSize: 95, marginTop: 25, textAlign: 'left', lineHeight: '83%' }}>{title}</div>
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
