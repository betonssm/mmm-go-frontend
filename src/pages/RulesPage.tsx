
import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/MMMGo.css"; // Убедись, что стили правильные

export default function RulesPage() {
  const navigate = useNavigate();

  return (
    <div
      className="info-page"
      style={{
        backgroundImage: `url(/assets/bg-rules.png)`,  // фон для страницы
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "30px", // отступ сверху
        paddingBottom: "30px", // отступ снизу
        minHeight: "100vh",  // минимальная высота, чтобы страница заполняла весь экран
        overflowY: "auto",  // прокрутка по вертикали
      }}
    >
      <h2 style={{ color: "#ffe082", textShadow: "2px 2px 6px #000", marginBottom: "20px" }}>
        📜 Правила игры MMM Go
      </h2>

      {/* Правила игры */}
      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>1. Ограничения и цели игры</h3>
        <p style={{ color: "#ffe082" }}>
          Все персонажи и названия в игре вымышленные. Главная цель игры — возможность для топовых инвесторов получать долю от ежемесячных доходов от рекламы в приложении и донатов, а также криптовалютный токен, который можно будет купить за игровые монеты **мавродики**.
        </p>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>2. Добыча монет "мавродики"</h3>
        <p style={{ color: "#ffe082" }}>
          Игроки добывают **мавродики** с помощью ежедневного **тапа** на главном экране. Игроки, которые не подписались на платную подписку, могут добывать до **10,000 мавродиков в сутки**. Добыча ограничена общим количеством, но может увеличиться, если количество участников игры превысит заданный лимит.
        </p>
        <p style={{ color: "#ffe082" }}>
          **За каждого приведённого игрока** по реферальной ссылке базовый игрок получает **5,000 мавродиков**.
        </p>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>3. Статус инвестора</h3>
        <p style={{ color: "#ffe082" }}>
          Чтобы стать **инвестором**, необходимо **подписаться на ежемесячную подписку**, стоимость которой **10$**. В качестве бонуса за подписку, инвестор получает **50,000 мавродиков** и попадает в **SR рейтинг**.
        </p>
        <p style={{ color: "#ffe082" }}>
          Инвесторы могут получать **10,000 мавродиков за каждого приведённого по реферальной ссылке** игрока. Рейтинг инвестора формируется на основе его активности, рефералов и дней в игре.
        </p>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>4. Фонд и распределение прибыли</h3>
        <p style={{ color: "#ffe082" }}>
          **Фонд** формируется ежемесячно и распределяется среди **топ 10% инвесторов** по итогам месяца. Фонд включает доходы от рекламы и донатов.
        </p>
        <p style={{ color: "#ffe082" }}>
          Для того чтобы попасть в топ 10% и разделить фонд, инвестор должен:
          <ul style={{ color: "#ffe082", listStyleType: "disc" }}>
            <li>Быть активным в игре.</li>
            <li>Привлекать рефералов.</li>
            <li>Докупать **50,000 мавродиков за 10$** один раз в месяц.</li>
          </ul>
        </p>
        <p style={{ color: "#ffe082" }}>
          **Распределение фонда**:
          <ul style={{ color: "#ffe082", listStyleType: "disc" }}>
            <li>**Топ-1%** — получает **30% фонда**.</li>
            <li>**Топ-2-5%** — получают **35% фонда**.</li>
            <li>**Топ-6-10%** — получают **35% фонда**.</li>
          </ul>
        </p>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(0, 0, 0, 0.6)", borderRadius: "12px" }}>
        <h3 style={{ color: "#ffe082" }}>5. Примечания и ограничения</h3>
        <p style={{ color: "#ffe082" }}>
          - **Фонд выплат** начнёт формироваться и выплачиваться после того, как количество участников игры достигнет **100,000 человек**.
        </p>
        <p style={{ color: "#ffe082" }}>
          - Игроки, которые нарушают правила, могут быть исключены из игры без возврата средств.
        </p>
        <p style={{ color: "#ffe082" }}>
          - Количество рефералов и активность влияют на рейтинг SR и шанс на попадание в топ 10%.
        </p>
        <p style={{ color: "#ffe082" }}>
          - Все средства, потраченные на подписку и докупку мавродиков, являются частью игрового процесса.
        </p>
      </div>

      {/* Кнопка "Правила" */}
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
          marginRight: "auto", // выравнивание по центру
        }}
      >
        Принять
      </button>
    </div>
  );
}