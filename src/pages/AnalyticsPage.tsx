
import React, { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("adminToken") || "";

  useEffect(() => {
    document.title = "Аналитика — MMM GO";

    fetch("https://mmmgo-backend.onrender.com/admin/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-6 text-center">Загрузка...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Общая аналитика</h1>
      <div className="grid grid-cols-2 gap-4 text-lg text-center">
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600">Всего игроков</div>
          <div className="text-2xl font-bold">{data.totalPlayers}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600">Фонд</div>
          <div className="text-2xl font-bold">{data.fundTotal} 💰</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600">Инвесторов</div>
          <div className="text-2xl font-bold">{data.investors}</div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <div className="text-gray-600">Средний баланс</div>
          <div className="text-2xl font-bold">{data.averageBalance}</div>
        </div>
        <div className="bg-white shadow rounded p-4 col-span-2">
          <div className="text-gray-600">Средний SR-рейтинг</div>
          <div className="text-2xl font-bold">{data.averageSR}</div>
        </div>
      </div>
    </div>
  );
}



       
