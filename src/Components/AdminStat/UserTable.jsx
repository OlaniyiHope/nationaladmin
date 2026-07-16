import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper, Megaphone } from "lucide-react";
import Layout from "../../Components/Layout/Layout";

/* ─── Helpers ─── */
const fmtDate = (val) =>
  val ? new Date(val).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "—";

const StatusBadge = ({ value }) => {
  const map = {
    published:  "bg-green-100 text-green-700",
    draft:      "bg-yellow-100 text-yellow-700",
    archived:   "bg-gray-100 text-gray-500",
    pending:    "bg-yellow-100 text-yellow-700",
    confirmed:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-700",
    active:     "bg-blue-100 text-blue-700",
    completed:  "bg-green-100 text-green-700",
  };
  const key = (value || "").toLowerCase();
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${map[key] || "bg-gray-100 text-gray-500"}`}>
      {value || "—"}
    </span>
  );
};

const HighlightBadges = ({ post }) => {
  const badges = [
    post.isBreaking && { label: "Breaking", cls: "bg-red-100 text-red-700" },
    post.isTrending && { label: "Trending", cls: "bg-blue-100 text-blue-700" },
    post.isFeatured && { label: "Featured", cls: "bg-purple-100 text-purple-700" },
    post.isEditorsPick && { label: "Editor's Pick", cls: "bg-pink-100 text-pink-700" },
  ].filter(Boolean);

  if (badges.length === 0) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <span key={b.label} className={`px-1.5 py-0.5 rounded text-xs ${b.cls}`}>
          {b.label}
        </span>
      ))}
    </div>
  );
};

const SkeletonRows = ({ cols, rows = 5 }) =>
  Array.from({ length: rows }).map((_, i) => (
    <tr key={i}>
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  ));

const EmptyRow = ({ cols, label }) => (
  <tr>
    <td colSpan={cols} className="py-12 text-center text-gray-400 text-sm">
      {label}
    </td>
  </tr>
);

/* ─── Recent Posts ─── */
const RecentPosts = ({ posts, loading, onView }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-10">
    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-white">
      <Newspaper className="w-4 h-4 text-purple-500" />
      <h2 className="text-base font-semibold text-gray-800">Recent Posts</h2>
      <span className="ml-auto text-xs text-gray-400">Latest 5</span>
    </div>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {["Title", "Category", "Author", "Published", "Highlights", "Status", "Actions"].map((h) => (
            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {loading ? (
          <SkeletonRows cols={7} />
        ) : posts.length === 0 ? (
          <EmptyRow cols={7} label="No recent posts found." />
        ) : (
          posts.map((post) => (
            <tr key={post._id} className="hover:bg-gray-50 transition-colors">
              {/* Title */}
              <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {post.title || "—"}
                </div>
                <div className="text-xs text-gray-400 truncate">{post.excerpt}</div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.category?.name || "—"}
              </td>

              {/* Author */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.author || "—"}
              </td>

              {/* Published */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{fmtDate(post.createdAt)}</div>
              </td>

              {/* Highlights */}
              <td className="px-6 py-4 whitespace-nowrap">
                <HighlightBadges post={post} />
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge value={post.status || "published"} />
              </td>

              {/* Action */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onView(`/admin/posts/${post._id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* ─── Recent Adverts ─── */
const RecentAdverts = ({ adverts, loading, onView }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-white">
      <Megaphone className="w-4 h-4 text-pink-500" />
      <h2 className="text-base font-semibold text-gray-800">Recent Adverts</h2>
      <span className="ml-auto text-xs text-gray-400">Latest 5</span>
    </div>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {["Company", "Ad Package", "Placement", "Duration", "Contact", "Status", "Actions"].map((h) => (
            <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {loading ? (
          <SkeletonRows cols={7} />
        ) : adverts.length === 0 ? (
          <EmptyRow cols={7} label="No recent adverts found." />
        ) : (
          adverts.map((advert) => (
            <tr key={advert._id} className="hover:bg-gray-50 transition-colors">
              {/* Company */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{advert.companyName}</div>
                <div className="text-xs text-gray-400">
                  Requested: {fmtDate(advert.createdAt)}
                </div>
              </td>

              {/* Ad Package */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advert.adPackage || "—"}
              </td>

              {/* Placement */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advert.placement || "—"}
              </td>

              {/* Duration */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {advert.startDate ? fmtDate(advert.startDate) : "—"}
                  {advert.endDate ? ` – ${fmtDate(advert.endDate)}` : ""}
                </div>
              </td>

              {/* Contact */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{advert.contactName}</div>
                <div className="text-xs text-gray-400">{advert.email}</div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge value={advert.status} />
              </td>

              {/* Action */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onView(`/admin/adverts/${advert._id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* ─── Main Page ─── */
const DashboardTables = () => {
  const [posts, setPosts] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const BASE = import.meta.env.VITE_BASE_URL;

    Promise.all([
      fetch(`${BASE}/db/posts`).then((r) => r.json()),
      fetch(`${BASE}/db/adverts`).then((r) => r.json()),
    ])
      .then(([postsData, advertsData]) => {
        const allPosts = Array.isArray(postsData) ? postsData : postsData.posts || [];
        const allAdverts = Array.isArray(advertsData) ? advertsData : advertsData.adverts || [];

        // Sort newest first, keep latest 5
        const latest5 = (arr) =>
          [...arr]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);

        setPosts(latest5(allPosts));
        setAdverts(latest5(allAdverts));
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="w-full px-3 lg:px-[8rem] py-8">
        <RecentPosts posts={posts} loading={loading} onView={navigate} />
        <RecentAdverts adverts={adverts} loading={loading} onView={navigate} />
      </div>
    </div>
  );
};

export default DashboardTables;