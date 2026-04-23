import { useEffect, useMemo, useState } from "react";

const baseTrend = [
  { month: "May", target: 28, actual: 27, adSpend: 2.8 },
  { month: "Jun", target: 29, actual: 28, adSpend: 2.9 },
  { month: "Jul", target: 30, actual: 29.4, adSpend: 3.1 },
  { month: "Aug", target: 31, actual: 30.8, adSpend: 3.2 },
  { month: "Sep", target: 33, actual: 32.2, adSpend: 3.4 },
  { month: "Oct", target: 40, actual: 39.5, adSpend: 4.2 },
  { month: "Nov", target: 47, actual: 45.8, adSpend: 4.9 },
  { month: "Dec", target: 38, actual: 37.6, adSpend: 4.1 },
  { month: "Jan", target: 34, actual: 33.9, adSpend: 3.7 },
  { month: "Feb", target: 33, actual: 32.8, adSpend: 3.6 },
  { month: "Mar", target: 36, actual: 35.6, adSpend: 3.8 },
  { month: "Apr", target: 41, actual: 40.1, adSpend: 4.3 }
];

function jitter(value, spread) {
  return Number((value + (Math.random() * 2 - 1) * spread).toFixed(2));
}

export function useRealtimeMetrics() {
  const [pulse, setPulse] = useState({
    ordersPerHour: 114,
    roas: 4.6,
    conversionRate: 5.2,
    returnRate: 2.06,
    repeatRate: 72.4,
    atRiskSkus: 3,
    updatedAt: new Date().toISOString()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((prev) => ({
        ordersPerHour: Math.max(70, Math.round(jitter(prev.ordersPerHour, 12))),
        roas: Math.max(2.5, jitter(prev.roas, 0.24)),
        conversionRate: Math.max(2.5, jitter(prev.conversionRate, 0.32)),
        returnRate: Math.max(1.2, jitter(prev.returnRate, 0.08)),
        repeatRate: Math.max(55, jitter(prev.repeatRate, 0.45)),
        atRiskSkus: Math.max(1, Math.round(jitter(prev.atRiskSkus, 1.4))),
        updatedAt: new Date().toISOString()
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const liveTrend = useMemo(
    () =>
      baseTrend.map((row) => ({
        ...row,
        actual: jitter(row.actual, 0.5),
        adSpend: jitter(row.adSpend, 0.12)
      })),
    [pulse.updatedAt]
  );

  const channelMix = useMemo(
    () => [
      { name: "Amazon.in", value: Number((67 + Math.random() * 1.5).toFixed(1)) },
      { name: "Flipkart", value: Number((15 + Math.random() * 1.1).toFixed(1)) },
      { name: "Nykaa", value: Number((9 + Math.random() * 0.8).toFixed(1)) },
      { name: "Meesho", value: Number((6 + Math.random() * 0.7).toFixed(1)) },
      { name: "JioMart", value: Number((3 + Math.random() * 0.5).toFixed(1)) }
    ],
    [pulse.updatedAt]
  );

  return { pulse, liveTrend, channelMix };
}
