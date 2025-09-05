'use server';

import { CreateInvoice } from "@/app/data/types";
import { Keypair } from "@solana/web3.js";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

const INVOICE_COOKIE_KEY = 'lamport-pay_tmp_invoice';

export async function createTmpInvoice(data: FormData) {
  const title = String(data.get('title')) ?? 'Project donation';
  const amount = parseFloat(String(data.get('amount'))) || 10;
  const recipient = String(data.get('receiver')) || process.env.MERCHANT_DEFAULT_ADDRESS!!;

  const referencePk = await new Keypair().publicKey;
  const reference = referencePk.toBase58();

  const payload: CreateInvoice = {
    title,
    amount,
    recipient,
    reference
  }

  const store = await cookies();
  store.set(INVOICE_COOKIE_KEY, JSON.stringify(payload), { 
    path: '/tmp', 
    httpOnly: false,
    sameSite: 'strict',
    maxAge: 60 * 60 // 1 hr
  });

  console.log("Temporary invoice created:", payload);

  redirect(`/tmp/${reference}`);
}