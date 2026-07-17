import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../Components/AdminHeader/AdminHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);

  const [postImages, setPostImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [postVideos, setPostVideos] = useState([]);
const [existingVideos, setExistingVideos] = useState([]);

const [videoImage, setVideoImage] = useState(null);
const [existingVideoImage, setExistingVideoImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/db/post/${id}`);
        const post = res.data;

        setPostTitle(post.title || "");
        setPostExcerpt(post.excerpt || "");
        setPostContent(post.content || "");
        setAuthor(post.author || "");
        setTags(post.tags || []);
        setSelectedCategory(post.category?._id || post.category || "");
        setIsBreaking(!!post.isBreaking);
        setIsTrending(!!post.isTrending);
        setIsFeatured(!!post.isFeatured);
        setIsEditorsPick(!!post.isEditorsPick);
        setExistingImages(post.images || []);
        setExistingVideos(post.videos || []);
setExistingVideoImage(post.videoImage || "");
      } catch (err) {
        console.error("Failed to fetch post:", err);
        toast.error("Failed to load post");
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_IMAGES) return toast.error(`Max ${MAX_IMAGES} images allowed.`);
    if (files.some((f) => f.size > MAX_IMAGE_SIZE)) return toast.error("Each image must be under 5MB.");
    setPostImages(files);
    setExistingImages([]); // hide old images once new ones are chosen
  };
const handleVideoChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length > 2) {
    return toast.error("Maximum 2 videos allowed");
  }

  setPostVideos(files);
  setExistingVideos([]);
};

const handleVideoImageChange = (e) => {
  const file = e.target.files[0];

  if(file){
    setVideoImage(file);
    setExistingVideoImage("");
  }
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

      formData.append("isBreaking", isBreaking);
      formData.append("isTrending", isTrending);
      formData.append("isFeatured", isFeatured);
      formData.append("isEditorsPick", isEditorsPick);

      // Only keep old images if no new ones were selected
      if (postImages.length === 0 && existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      // Add new images if any
      if (postImages.length > 0) {
        postImages.forEach((img) => formData.append("images", img));
      }
// Keep old videos
if(postVideos.length === 0 && existingVideos.length > 0){
 formData.append(
   "existingVideos",
   JSON.stringify(existingVideos)
 );
}


// Upload new videos
if(postVideos.length > 0){
 postVideos.forEach((video)=>{
   formData.append("videos", video);
 });
}


// Keep old thumbnail
if(!videoImage && existingVideoImage){
 formData.append(
   "existingVideoImage",
   existingVideoImage
 );
}


// Upload new thumbnail
if(videoImage){
 formData.append(
   "videoImage",
   videoImage
 );
}
      await axios.put(`${import.meta.env.VITE_BASE_URL}/db/post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post updated successfully!");
      setTimeout(() => navigate("/posts"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <AdminHeader />
        <div className="p-6 max-w-2xl mx-auto">Loading post...</div>
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AdminHeader />
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Post</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Post Title</label>
          <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)}
            placeholder="e.g. Senate passes new finance bill"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Excerpt / Summary</label>
          <textarea value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)}
            rows={2} placeholder="Short summary shown in listings..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Content</label>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)}
            rows={10} placeholder="Write the full article here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. Patrick Odey"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <ArrayInputField label="Tags" values={tags} setValues={setTags} />

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
          <label className="block font-medium mb-1">Post Images (max 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full" />
        </div>

        <div className="flex gap-2 mt-2 mb-4">
          {/* Existing images (from DB) */}
          {existingImages.map((img, idx) => (
            <img key={`existing-${idx}`} src={img} alt="existing"
              className="w-20 h-20 object-cover border" />
          ))}

<div className="mb-4">

<label className="block font-medium mb-2">
 Existing Videos
</label>

{existingVideos.length > 0 ? (
  existingVideos.map((video, idx) => (
    <video
      key={idx}
      src={video}
      controls
      className="w-80 border rounded mb-3"
    />
  ))
) : (
  <p className="text-gray-500">
    No video found
  </p>
)}

</div>
          {/* New images (not yet uploaded) */}
          {postImages.map((file, idx) => (
            <img key={`new-${idx}`} src={URL.createObjectURL(file)} alt="new"
              className="w-20 h-20 object-cover border" />
          ))}
        </div>
<div className="mb-4">

<label className="block font-medium mb-1">
Video Thumbnail Image
</label>

<input
type="file"
accept="image/*"
onChange={handleVideoImageChange}
/>


{existingVideoImage && (
<img
src={existingVideoImage}
className="w-32 h-32 object-cover mt-2"
/>
)}


{videoImage && (
<img
src={URL.createObjectURL(videoImage)}
className="w-32 h-32 object-cover mt-2"
/>
)}

</div>
<div className="mb-4">

<label className="block font-medium mb-1">
Change Video
</label>

<input
type="file"
multiple
accept="video/*"
onChange={handleVideoChange}
/>

</div>
{postVideos.map((video,index)=>(
<video
key={index}
src={URL.createObjectURL(video)}
controls
className="w-80 mt-2"
/>
))}
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
            style={{ backgroundColor: loading ? "#ccc" : "#042954" }}>
            {loading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditPost;