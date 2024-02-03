import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

// const fontSubtitle = fetch(new URL('../../assets/EBGaramond-Medium.ttf', import.meta.url)).then(
//   (res) => res.arrayBuffer()
// )

const font = fetch(new URL('../../assets/EBGaramond-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
)

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const fontData = await font
    // const fontSubtitleData = await fontSubtitle

    const hasTitle = searchParams.has('title') && searchParams.get('title').trim().length > 0
    const title = searchParams.get('title')?.slice(0, 200)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f6eee3',
            fontFamily: 'EB Garamond'
          }}
        >
          {hasTitle ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ fontSize: 65 }}>notes.xdavidhu.me</div>
              <div style={{ fontSize: 90, marginTop: 10, marginLeft: 40, marginRight: 40, textAlign: 'center', lineHeight: '92%' }}>{title}</div>
            </div>
          ) : (
            <div style={{ fontWeight: 700, fontSize: 110 }}>notes.xdavidhu.me</div>
          )}
        </div>

      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'EB Garamond',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
          // {
          //   name: 'EB Garamond',
          //   data: fontSubtitleData,
          //   style: 'normal',
          //   weight: 500,
          // },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
