// app/api/tx/usdc/route.ts
import { NextRequest } from 'next/server';
import {
  Connection, PublicKey, SystemProgram, Transaction, ComputeBudgetProgram,
  TransactionInstruction,
  Keypair
} from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferCheckedInstruction } from '@solana/spl-token'; // opcional se preferir SPL helpers
import BigNumber from 'bignumber.js';

const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!;
const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS!);
const MERCHANT = new PublicKey(process.env.MERCHANT_DEFAULT_ADDRESS!);

export async function GET(req: NextRequest) {
  const icon = 'https://exiledapes.academy/wp-content/uploads/2021/09/X_share.png';
  const { searchParams } = new URL(req.url);
  const amountStr = searchParams.get('amount') ?? '0';
  const label = searchParams.get('label') ?? 'LamportPay';
  const message = searchParams.get('message') ?? 'Payment';
  
  return Response.json({
        label,
        icon,
  });
}

export async function POST(req: NextRequest) {
  try {
    // A wallet envia { account: <payerPubkey> } no body; query traz params do link
    const { searchParams } = new URL(req.url);
    const amountStr = searchParams.get('amount') ?? '0';
    const label = searchParams.get('label') ?? 'LamportPay';
    const message = searchParams.get('message') ?? 'Payment';
    const { account } = await req.json().catch(() => ({} as any));
    
    if (!account) {
      return Response.json({ error: 'Missing account' }, { status: 400 });
    }

    console.log("Account:", account);

    const payer = new PublicKey(account);
    const amount = new BigNumber(amountStr); // em unidades de usuário (ex: 10 USDC)

    const conn = new Connection(RPC, 'confirmed');

    const payerAta = await getAssociatedTokenAddress(USDC_MINT, payer);
    const payerAtaInfo = await conn.getTokenAccountBalance(payerAta).catch(() => null);
    const ui = payerAtaInfo?.value?.uiAmount ?? 0;

    if (ui < amount.toNumber()) {
      // 🔴 Sem saldo suficiente -> responda de forma AMIGÁVEL
      // O padrão de Transaction Request permite devolver erro + mensagem para a wallet exibir.
      return Response.json({
        error: 'INSUFFICIENT_FUNDS',
        title: 'You need USDC to complete this payment',
        message:
          'This request requires USDC. Top up your wallet or swap SOL → USDC, then try again.',

        alternatives: {
          payWithSOL: `solana:${MERCHANT.toBase58()}?amount=${amount.toString()}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`,
          swap: `https://jup.ag/swap/SOL-USDC?amount=${amount.toString()}`,
        },
      }, { status: 402 }); // 402 Payment Required (semântica clara)
    }

    // === Montar transação USDC ===
    const blockhash = await conn.getLatestBlockhash();
    const tx = new Transaction({
      feePayer: payer,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    });

    // compute budget (opcional)
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }));

    // ATA do merchant (garanta existência para receber)
    const merchantAta = await getAssociatedTokenAddress(USDC_MINT, MERCHANT);
    const merchantAtaInfo = await conn.getAccountInfo(merchantAta);

    if (!merchantAtaInfo) {
      tx.add(createAssociatedTokenAccountInstruction(payer, merchantAta, MERCHANT, USDC_MINT));
    }

    // transfer USDC com decimals = 6 (USDC mainnet)
    const DECIMALS = 6;
    const raw = BigInt(Math.round(amount.toNumber() * 10 ** DECIMALS));
    const reference = new Keypair().publicKey;
    const splTransferIx = createTransferCheckedInstruction(
        payerAta,          // source ATA
        USDC_MINT,         // mint
        merchantAta,       // dest ATA
        payer,             // owner
        raw,               // amount in base units
        DECIMALS
    );

    tx.add(
      splTransferIx  
    ); 

    splTransferIx.keys.push({ pubkey: reference, isWritable: false, isSigner: false });
    
    //another way to add reference
    //tx.add(new TransactionInstruction({ keys: [{pubkey: reference, isSigner: false, isWritable: false}], programId: MEMO_PROGRAM_ID, data: Buffer.from(reference ?? '') }))

    const serialized = tx.serialize({ requireAllSignatures: false }).toString('base64');

    return Response.json({
      transaction: serialized,
      message: `${label} • ${message}`,
      // opcional: redirect após assinatura
      // redirect: `https://seuapp/paid/${reference}`
    });
  } catch (e: any) {
    return Response.json({ error: e?.message ?? 'Unhandled error' }, { status: 500 });
  }
}
