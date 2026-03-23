'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface PageContextType {
  title: string;
  description: string;
  url: string;
  slug?: string[];
}

const PageContext = createContext<PageContextType | null>(null);

export function PageContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PageContextType;
}) {
  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
