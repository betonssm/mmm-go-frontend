
import React, { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";

export default function AdminLogs() {
  useEffect(() => {
    document.title = "Журнал логов | Админка MMM GO";
  }, []);

  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const token = localStorage.getItem("adminToken") || "";

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
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">Журнал действий</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border w-32">Дата</th>
              <th className="p-2 border">Тип</th>
              <th className="p-2 border">Сообщение</th>
              <th className="p-2 border">ID игрока</th>
              <th className="p-2 border">Детали</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((log, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-2 border whitespace-nowrap text-sm text-gray-700">
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
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            &larr;
          </button>

          {currentPage > 2 && (
            <>
              <button onClick={() => setCurrentPage(1)} className="px-2 py-1 border rounded">
                1
              </button>
              {currentPage > 3 && <span className="px-1">…</span>}
            </>
          )}

          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((p) => p > 1 && p < totalPages)
            .map((p) => (
              <button
                key={p}
                className={`px-2 py-1 border rounded ${currentPage === p ? "bg-yellow-300 font-bold" : "bg-white"}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span className="px-1">…</span>}
              <button onClick={() => setCurrentPage(totalPages)} className="px-2 py-1 border rounded">
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}



       
