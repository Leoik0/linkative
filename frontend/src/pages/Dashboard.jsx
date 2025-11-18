import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    async function fetchAdminId() {
      const userEmail = user?.email || user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) return;

      try {
        const res = await fetch(
          `http://localhost:4000/api/admin?email=${userEmail}`
        );
        if (res.ok) {
          const data = await res.json();
          setAdminId(data.id);
        }
      } catch (err) {
        console.error("Erro ao buscar admin:", err);
      }
    }
    fetchAdminId();
  }, [user]);

  useEffect(() => {
    async function fetchStats() {
      if (!adminId) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/analytics/stats/${adminId}`
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [adminId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Nenhuma estatística disponível</p>
      </div>
    );
  }

  // Dados para gráfico de cliques por link
  const clicksByLinkData = {
    labels: stats.clicksByLink.map((l) => l.title),
    datasets: [
      {
        label: "Cliques",
        data: stats.clicksByLink.map((l) => l.clicks),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de cliques por horário
  const clicksByHourData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "Cliques por Horário",
        data: stats.clicksByHour,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        tension: 0.4,
      },
    ],
  };

  // Dados para gráfico de top cidades
  const topCitiesData = {
    labels: stats.topCities.map((c) => c.city),
    datasets: [
      {
        label: "Cliques",
        data: stats.topCities.map((c) => c.clicks),
        backgroundColor: [
          "rgba(59, 130, 246, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(245, 158, 11, 0.6)",
          "rgba(239, 68, 68, 0.6)",
          "rgba(139, 92, 246, 0.6)",
        ],
      },
    ],
  };

  // Dados para gráfico de origem do tráfego
  const referrerData = {
    labels: stats.topReferrers?.map((r) => r.referrer) || [],
    datasets: [
      {
        label: "Cliques",
        data: stats.topReferrers?.map((r) => r.clicks) || [],
        backgroundColor: [
          "rgba(225, 29, 72, 0.6)", // Instagram
          "rgba(37, 99, 235, 0.6)", // Facebook
          "rgba(59, 130, 246, 0.6)", // Twitter
          "rgba(16, 185, 129, 0.6)", // WhatsApp
          "rgba(234, 88, 12, 0.6)", // Google
          "rgba(139, 92, 246, 0.6)", // TikTok
          "rgba(245, 158, 11, 0.6)", // Outros
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          📊 Dashboard de Analytics
        </h1>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total de Cliques</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalClicks}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Links Ativos</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.clicksByLink.length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Link Mais Popular</p>
                <p className="text-lg font-bold text-purple-600 truncate">
                  {stats.topLinks[0]?.title || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {stats.topLinks[0]?.clicks || 0} cliques
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cliques por Link */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cliques por Link
            </h2>
            <Bar
              data={clicksByLinkData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>

          {/* Cliques por Horário */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Cliques por Horário
            </h2>
            <Line
              data={clicksByHourData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true, ticks: { stepSize: 1 } },
                },
              }}
            />
          </div>
        </div>

        {/* Origem do Tráfego */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Origem do Tráfego */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Origem do Tráfego
            </h2>
            {stats.topReferrers && stats.topReferrers.length > 0 ? (
              <Bar
                data={referrerData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma origem registrada ainda
              </p>
            )}
          </div>

          {/* Top Cidades */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Top Cidades
            </h2>
            {stats.topCities.length > 0 ? (
              <Doughnut
                data={topCitiesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "bottom" },
                  },
                }}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma cidade registrada ainda
              </p>
            )}
          </div>
        </div>

        {/* Ranking e Picos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ranking e Picos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Horários de Pico
            </h2>
            <div className="space-y-4">
              {stats.peakHours.map((peak, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-gray-700">
                      {peak.hour}
                    </span>
                  </div>
                  <span className="text-blue-600 font-bold">
                    {peak.clicks} cliques
                  </span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
              Top 5 Links
            </h2>
            <div className="space-y-3">
              {stats.topLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-700">
                        {link.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold">{link.clicks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
