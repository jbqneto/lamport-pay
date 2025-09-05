'use client'
import { createQR } from '@solana/pay'
import dynamic from 'next/dynamic'
import { HTMLAttributes, useEffect } from 'react'

type QrBoxProps = HTMLAttributes<HTMLDivElement> & {
  value?: string | URL
  size?: number
  level?: 'L' | 'M' | 'Q' | 'H'
  bgColor?: string
  fgColor?: string
  viewBox?: string
  title?: string
}

const QRCode = dynamic(() => import('react-qr-code'), { ssr: false })

export function QRCodeBox({ value, size = 128, className, level,fgColor, bgColor, ...rest }: QrBoxProps) {
  
  useEffect(() => {
    if (value instanceof URL) {
      const qrCode = createQR(value);
      const element = document.getElementById('qr-code');
      if (element) {
        element.innerHTML = '';
        qrCode.append(element);
      }
    }
  }, [value]);

  const URLQrCode = () => {
    return (
      <div id='qr-code' className='qr-code w-full flex flex-col items-center space-y-4'> 

      </div>
    )
  }

  const TextQrCode = (value: string) => {
    return (
      <div id='qr-code' className='qr-code w-full flex flex-col items-center space-y-4'> 
      <QRCode
          value={value ?? ''}
        size={size}
        bgColor={bgColor ?? '#FFFFFF'}
        fgColor={fgColor ?? '#000000'}
        level={level ?? 'M'}
        className={className}
        onLoad={e => console.log('QR code loaded', e)}
      />
      </div>
    )
  }
  
  return (
    <div style={{minHeight: size}} {...rest} className="rounded-lg bg-white p-4 shadow-lg">
      
      { value ? TextQrCode(value.toString()) : URLQrCode() }
      
    </div>
  )
}