
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // правильный путь к стилям

// Пример баланса и уровня
const balance = 2500000; // Пример баланса
const level = Math.floor(balance / 1000000); // Ранг на основе баланса
const progress = (balance % 1000000) / 1000000; // Прогресс к следующему уровню

// Пример общего пула
const totalPool = 5000000; // Это пример общей суммы пула, её можно менять в зависимости от логики игры

export default function RankPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rank.png)`, // путь к фону
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px", // отступ сверху
        paddingBottom: "30px", // добавляем отступ снизу
      }}
    >
      {/* Блок с общей суммой пула */}
      <div style={{
        position: "relative", // внутри потока документа
        marginBottom: "20px", // отступ снизу
        background: "rgba(255, 215, 0, 0.7)",
        color: "#000",
        fontSize: "18px", // уменьшенный размер текста
        padding: "8px 15px", // уменьшенные отступы
        borderRadius: "12px",
        fontWeight: "bold",
        boxShadow: "0 0 10px #ffd700",
        zIndex: 10,
        textAlign: "center", // центрируем текст внутри блока
        maxWidth: "90%", // ограничиваем ширину блока
        margin: "0 auto", // выравнивание по центру
      }}>
        <h3>Общий фонд на этот месяц: {totalPool} мавродиков</h3>
        <p>Этот пул разделяется среди топ 10% инвесторов</p>
      </div>

      {/* Заголовок страницы */}
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "8px" }}>
        🏅 Твой Инвесторский Ранг
      </h2>

      <p style={{ marginBottom: "8px", color: "#ffe082" }}>
        Ты уже инвестор уровня <strong>{level}</strong>!<br />
        А может, почти...
      </p>

      <p style={{ color: "#ffe082" }}>
        Чем больше у тебя мавродиков, тем выше твой статус.
        <br />
        Следующий ранг откроется при новом уровне 💸
      </p>

      {/* Прогресс-бар */}
      <div style={{ width: "100%", backgroundColor: "#ddd", borderRadius: "10px", overflow: "hidden", marginBottom: "20px" }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: "10px",
            background: "linear-gradient(to right, #ffe259, #ffa751)",
            borderRadius: "10px",
          }}
        ></div>
      </div>

      {/* Ключевые принципы */}
      <div style={{ marginTop: "20px", padding: "20px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000" }}>📊 Ключевые принципы:</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li><strong style={{ color: "#ffe082" }}>1. Фонд состоит из выплат от:</strong>инвестиций и дохода от рекламы</li>
          <li><strong style={{ color: "#ffe082" }}>2. Фонд разделяется по итогам месяца среди топ</strong>10% инвесторов</li>
          <li><strong style={{ color: "#ffe082" }}>3. Рейтинг инвесторов формируется исходя из количества баллов</strong>SR</li>
          <li><strong style={{ color: "#ffe082" }}>4. Чтобы участвовать в разделе фонда, инвестор должен быть активен минимум:</strong>22 дня в месяц.</li>
        </ul>
      </div>

      {/* Кнопка назад */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          fontSize: "16px",
          borderRadius: "12px",
          background: "linear-gradient(to bottom, #ffe259, #ffa751)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 0 10px #ffca28",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto", // выравнивание кнопки по центру
        }}
      >
        🔙 Назад
      </button>
    </div>
  );
}