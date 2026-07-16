import React, { useState, useEffect } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { LuView } from "react-icons/lu";
import Layout from "../../Components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const PostList = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/db/posts`);
        const data = await res.json();
        const cleaned = Array.isArray(data) ? data : data.posts || [];
        setPosts(cleaned.map((p) => ({ ...p, title: p.title?.trim() || "" })));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleAction = async (action, post) => {
    setOpenDropdownId(null);

    switch (action) {
      case "view":
        navigate(`/post/${post._id}`);
        break;
      case "edit":
        navigate(`/edit-post/${post._id}`);
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this post?")) {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_BASE_URL}/db/post/${post._id}`,
              { method: "DELETE" }
            );
            if (response.ok) {
              setPosts((prev) => prev.filter((p) => p._id !== post._id));
            } else {
              const data = await response.json();
              alert("Failed to delete: " + data.message);
            }
          } catch (error) {
            console.error("Error deleting post:", error);
          }
        }
        break;
      default:
        break;
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return isNaN(date) ? "—" : date.toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="w-full px-3 lg:px-[8rem]">
        <div className="px-4 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-800">All Posts</h1>
          <p className="text-gray-600 mt-1">View and manage all your published articles</p>
        </div>

        {/* Search + Add */}
        <div className="lg:flex justify-between lg:space-x-5 space-y-4 lg:space-y-0 items-center mb-6">
          <input
            type="text"
            placeholder="Search post..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="btn w-full lg:w-[20%]">
            <button
              className="px-6 py-3 text-white w-full rounded-md"
              onClick={() => navigate("/add-post")}
              style={{ backgroundColor: "#b90705" }}
            >
              Add New Post
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Videos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excerpt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highlights</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.images?.[0] ? (
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {post.videos?.[0] ? (
                      <video
                        src={post.videos[0]}
                        alt={post.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                        No videos
                      </div>
                    )}
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    {post.title}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {post.category?.name || "—"}
                  </td>

                  {/* Author */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {post.author || "—"}
                  </td>

                  {/* Excerpt */}
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                    {post.excerpt || "—"}
                  </td>

                  {/* Published date */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(post.createdAt || post.publishedAt)}
                  </td>

                  {/* Highlights */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {post.isBreaking && <span className="bg-red-100 text-red-700 px-1 rounded text-xs">Breaking</span>}
                      {post.isTrending && <span className="bg-blue-100 text-blue-700 px-1 rounded text-xs">Trending</span>}
                      {post.isFeatured && <span className="bg-purple-100 text-purple-700 px-1 rounded text-xs">Featured</span>}
                      {post.isEditorsPick && <span className="bg-pink-100 text-pink-700 px-1 rounded text-xs">Editor's Pick</span>}
                      {!post.isBreaking && !post.isTrending && !post.isFeatured && !post.isEditorsPick && "—"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === post._id ? null : post._id)
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openDropdownId === post._id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button onClick={() => handleAction("view", post)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <LuView className="w-4 h-4 mr-2" /> View
                          </button>
                          <button onClick={() => handleAction("edit", post)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </button>
                          <button onClick={() => handleAction("delete", post)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center px-6 py-8 text-gray-500">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default PostList;