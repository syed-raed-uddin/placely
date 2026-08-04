'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DashboardData, dashboardData as fallbackData } from '@/lib/mockData';

const DashboardContext = createContext<{ data: DashboardData; loading: boolean }>({ data: fallbackData, loading: true });

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children, initialData }: { children: React.ReactNode, initialData?: DashboardData }) => {
  const [data, setData] = useState<DashboardData>(initialData || fallbackData);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
    }
  }, [initialData]);

  return <DashboardContext.Provider value={{ data, loading }}>{children}</DashboardContext.Provider>;
};
