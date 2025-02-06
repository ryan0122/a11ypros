'use client';

import { useId } from 'react';

// Generates a random string for id's etc.

export function createId() {
  return useId();
}