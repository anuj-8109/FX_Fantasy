import { useState, useEffect } from "react";
// import Papa from "papaparse";

export function useSheetData(sheetCSVUrl) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sheetCSVUrl) return;

    const fetchData = async () => {
      try {
        const res = await fetch(sheetCSVUrl.replace("/edit#gid=", "/export?format=csv&gid="));
        const csvText = await res.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data.map((d, idx) => ({
              _id: idx,
              stock_name: d.StockName || d.stock_name || `Stock ${idx}`,
              last_price: Number(d.Price || d.last_price || 0),
              price_change: Number(d.Change || d.price_change || 0),
            })));
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Error fetching sheet data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [sheetCSVUrl]);

  return { data, loading };
}
