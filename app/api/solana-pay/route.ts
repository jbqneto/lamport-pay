import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';

import { z } from 'zod';
import { createPublicKeyReferenceFromOrderId } from '@/app/server/crypto.util';
import { generateSolanaPayURL } from '@/lib/solana-pay';
import { generateRandomInvoiceId } from '@/lib/utils';

const USDC_ADDRESS = process.env.USDC_MINT_ADDRESS;

if (!USDC_ADDRESS) {
  throw new Error('USDC address not configured.');
}

const USDC_MINT = new PublicKey(USDC_ADDRESS);

const BodySchema = z.object({
  receiver: z.string(),              
  amount: z.number().positive(),
  label: z.string(),
  message: z.string().optional(),
  memo: z.string().optional(),
  reference: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => ({}));

  console.log("Received request body:", json);

  const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid body', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { receiver, amount, label, message, memo } = parsed.data;
  const invoiceId = generateRandomInvoiceId();

  const reference = parsed.data.reference ?? await createPublicKeyReferenceFromOrderId(invoiceId);

  const url = generateSolanaPayURL({
    recipient: receiver,
    amount: amount,
    reference: typeof reference === 'string' ? new PublicKey(reference) : reference,
    label,
    message,
    memo,
    token: USDC_MINT,
  });

  return NextResponse.json({
    url: url.toString(),
    fields: {
      recipient: receiver,
      amount: Number(amount),
      splToken: USDC_MINT.toBase58(),
      reference,
      label,
      message,
      memo,
    },
  });
}
