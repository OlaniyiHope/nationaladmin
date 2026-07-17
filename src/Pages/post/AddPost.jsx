
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEOS = 2;
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

const ArrayInputField = ({ label, values, setValues }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
      setInput("");
    }
  };

  const handleRemove = (item) => setValues(values.filter((v) => v !== item));

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((val) => (
          <span key={val} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full flex items-center gap-1">
            {val}
            <button type="button" onClick={() => handleRemove(val)} className="text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder={`Add ${label.toLowerCase()}`}
          className="flex-1 p-2 border rounded"
        />
        <button type="button" onClick={handleAdd}
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: "#007a47" }}>+</button>
      </div>
    </div>
  );
};

const AddPost = () => {
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postVideos, setPostVideos] = useState([]);
  const [loading, setLoading] = useState(false);
const [videoImage, setVideoImage] = useState(null);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/db/categories`);
        const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_IMAGES) return toast.error(`Max ${MAX_IMAGES} images allowed.`);
    if (files.some((f) => f.size > MAX_IMAGE_SIZE)) return toast.error("Each image must be under 5MB.");
    setPostImages(files);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_VIDEOS) return toast.error(`Max ${MAX_VIDEOS} videos allowed.`);
    if (files.some((f) => f.size > MAX_VIDEO_SIZE)) return toast.error("Each video must be under 200MB.");
    setPostVideos(files);
  };
const handleVideoImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return toast.error("Please select an image file");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return toast.error("Video thumbnail must be under 5MB");
  }

  setVideoImage(file);
};
  const handleSubmit = async () => {
    if (!postTitle.trim()) return toast.error("Post title is required");
    if (!postContent.trim()) return toast.error("Post content is required");

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("title", postTitle);
      formData.append("excerpt", postExcerpt);
      formData.append("content", postContent);
      formData.append("author", author);

      tags.forEach((t) => formData.append("tags", t));

      if (selectedCategory) formData.append("category", selectedCategory);

 postImages.forEach((img) => {
  formData.append("images", img);
});


postVideos.forEach((vid) => {
  formData.append("videos", vid);
});


if(videoImage){
  formData.append("videoImage", videoImage);
}
      formData.append("isBreaking", isBreaking);
      formData.append("isTrending", isTrending);
      formData.append("isFeatured", isFeatured);
      formData.append("isEditorsPick", isEditorsPick);

      await axios.post(`${import.meta.env.VITE_BASE_URL}/db/create-post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post added successfully!");
      setTimeout(() => navigate("/post"), 3100);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminHeader />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Post</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Post Title</label>
          <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)}
            placeholder="e.g. Senate passes new finance bill" className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Excerpt / Summary</label>
          <textarea value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)}
            rows={2} placeholder="Short summary shown in listings..." className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Content</label>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)}
            rows={10} placeholder="Write the full article here..." className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Patrick Odey" className="w-full p-2 border rounded" />
        </div>

        <ArrayInputField label="Tags" values={tags} setValues={setTags} />

        {/* Single Category Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded">
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Post Images (max {MAX_IMAGES})</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
          {postImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{postImages.length} image(s) selected</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Post Videos (max {MAX_VIDEOS}, 200MB each)</label>
          <input type="file" multiple accept="video/*" onChange={handleVideoChange} className="w-full" />
          {postVideos.length > 0 && (
            <div className="mt-2 space-y-2">
              {postVideos.map((file, idx) => (
                <video
                  key={idx}
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full max-w-xs rounded border"
                />
              ))}
            </div>
          )}
        </div>
<div className="mb-4">

<label className="block font-medium mb-1">
Video Thumbnail Image
</label>

<input
type="file"
accept="image/*"
onChange={handleVideoImageChange}
className="w-full"
/>


{videoImage && (
<div className="mt-2">

<p className="text-xs text-gray-500">
Selected thumbnail:
</p>

<img
src={URL.createObjectURL(videoImage)}
alt="video thumbnail"
className="w-40 h-40 object-cover rounded border"
/>

</div>
)}

</div>
        <div className="mb-6">
          <label className="block font-medium mb-2">Post Highlights</label>
          <div className="flex gap-4 flex-wrap">
            {[
              ["isBreaking", "Breaking News", isBreaking, setIsBreaking],
              ["isTrending", "Trending", isTrending, setIsTrending],
              ["isFeatured", "Featured", isFeatured, setIsFeatured],
              ["isEditorsPick", "Editor's Pick", isEditorsPick, setIsEditorsPick],
            ].map(([key, label, val, setter]) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={val} onChange={(e) => setter(e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 text-white rounded"
            style={{ backgroundColor: loading ? "#ccc" : "#007a47" }}>
            {loading ? "Adding..." : "Add Post"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddPost;