'use client';

import { Button } from "../ui/button";


export function ScrollButton({targetId, label}: {targetId: string, label: string}) {

  return (
  <Button variant="outline" size="lg" className="btn-secondary text-base px-8 py-3"
                onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}>
                {label}
  </Button>
  );
}