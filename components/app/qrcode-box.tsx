'use client'
import dynamic from 'next/dynamic'
import { HTMLAttributes } from 'react'

type QrBoxProps = HTMLAttributes<HTMLDivElement> & {
  value?: string
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  viewBox?: string
  title?: string
}

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false })

export function QRCodeBox({ value, size, className, level,fgColor, bgColor, ...rest }: QrBoxProps) {
  return (
    <div {...rest} className="rounded-lg bg-white p-4 shadow-lg">
      <QRCode
        value={value ?? ''}
        size={size ?? 128}
        bgColor={bgColor ?? '#FFFFFF'}
        fgColor={fgColor ?? '#000000'}
        level={level ?? 'M'}
        className={className}
      />
    </div>
  )
}