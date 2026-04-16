import { useEffect } from 'react';
import { initializeApp } from '../init';

export function useAppInit() {
  useEffect(() => {
    initializeApp();
  }, []);
}
