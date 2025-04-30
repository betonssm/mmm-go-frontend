
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminLogs() {
  useEffect(() => {
    document.title = "Журнал логов | Админка MMM GO";
  }, []);
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("adminToken") || "";
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 20;

  useEffect(() => {
    fetch("https://mmmgo-backend.onrender.com/admin/logs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Ошибка загрузки логов:", err));
  }, []);
  const pageStart = (currentPage - 1) * itemsPerPage;
const pageEnd = pageStart + itemsPerPage;
const paginated = logs.slice(pageStart, pageEnd);
const totalPages = Math.ceil(logs.length / itemsPerPage);

  return (
   
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Журнал действий</h1>

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 border">Дата</th>
            <th className="p-2 border">Тип</th>
            <th className="p-2 border">Сообщение</th>
            <th className="p-2 border">ID игрока</th>
            <th className="p-2 border">Детали</th>
          </tr>
        </thead>
        <tbody>
        {paginated.map((log, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-2 border text-sm text-gray-700 w-32 whitespace-nowrap">
              {new Date(log.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border text-center">{log.type}</td>
              <td className="p-2 border">{log.message}</td>
              <td className="p-2 border text-center">{log.playerId || "—"}</td>
              <td className="p-2 border">
                <details>
                  <summary className="cursor-pointer text-blue-600 hover:underline">Показать</summary>
                  <pre className="text-xs whitespace-pre-wrap mt-1 bg-gray-100 p-2 rounded">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </details>
              </td>
            </tr>
          ))}
          <div className="flex gap-2 justify-center items-center flex-wrap">
  {currentPage > 2 && (
    <>
      <button onClick={() => setCurrentPage(1)} className="px-2">1</button>
      {currentPage > 3 && <span className="px-1">…</span>}
    </>
  )}

  {[currentPage - 1, currentPage, currentPage + 1]
    .filter(p => p > 1 && p < totalPages)
    .map((p) => (
      <button
        key={p}
        className={`px-2 ${currentPage === p ? "font-bold" : ""}`}
        onClick={() => setCurrentPage(p)}
      >
        {p}
      </button>
    ))}

  {currentPage < totalPages - 1 && (
    <>
      {currentPage < totalPages - 2 && <span className="px-1">…</span>}
      <button onClick={() => setCurrentPage(totalPages)} className="px-2">{totalPages}</button>
    </>
  )}
</div>
        </tbody>
      </table>
    </div>
   
  );
}



       
