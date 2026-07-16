import { useEffect, useState } from "react";
import { Newspaper, FolderKanban, Flame, Megaphone, ArrowUpRight } from "lucide-react";

const safeFetchArray = async (url, headers, unwrapKey) => {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`${url} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data[unwrapKey] || [];
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return [];
  }
};

const StatsCards = () => {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    breaking: 0,
    adverts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = import.meta.env.VITE_BASE_URL;
    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.all([
      safeFetchArray(`${BASE}/db/posts`, headers, "posts"),
      safeFetchArray(`${BASE}/db/categories`, headers, "categories"),
      safeFetchArray(`${BASE}/db/adverts`, headers, "adverts"),
    ]).then(([posts, categories, adverts]) => {
      const breaking = posts.filter((p) => p.isBreaking).length;

      setStats({
        posts: posts.length,
        categories: categories.length,
        breaking,
        adverts: adverts.length,
      });
      setLoading(false);
    });
  }, []);

  const cards = [
    {
      title: "Total Posts",
      value: loading ? "—" : stats.posts.toLocaleString(),
      icon: <Newspaper className="w-6 h-6 text-white" />,
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Categories",
      value: loading ? "—" : stats.categories.toLocaleString(),
      icon: <FolderKanban className="w-6 h-6 text-white" />,
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Breaking News",
      value: loading ? "—" : stats.breaking.toLocaleString(),
      icon: <Flame className="w-6 h-6 text-white" />,
      gradient: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      title: "Advert Requests",
      value: loading ? "—" : stats.adverts.toLocaleString(),
      icon: <Megaphone className="w-6 h-6 text-white" />,
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  return (
    <div className="px-3 lg:px-[8rem] py-6">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.gradient} rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                {card.icon}
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/60" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-white/80">{card.title}</h3>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? (
                  <span className="inline-block w-16 h-7 bg-white/20 rounded animate-pulse" />
                ) : (
                  card.value
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;