// lib/reference.ts
import crypto from 'node:crypto';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import { generateKeyPairSigner } from "@solana/kit";

/** Determinístico on-curve via Ed25519 (seed -> keypair) */
export function createPublicKeyReferenceFromOrderId(orderId: string): PublicKey {
  let secret = process.env.SECRET_PREFIX;
  
  if (!secret) {
    throw new Error('SECRET_PREFIX not configured.');
  } 

  const h = crypto.createHmac('sha256', secret).update(orderId).digest();
  
  const seed = new Uint8Array(h.buffer, h.byteOffset, h.byteLength);
  
  const kp = nacl.sign.keyPair.fromSeed(seed);  // TweetNaCl: fromSeed(32 bytes)
  
  return new PublicKey(kp.publicKey);
}

export async function createPublicKeyRandomReference(): Promise<string> {
  const signer = await generateKeyPairSigner();
  return signer.address;
}