import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "masterhub");

  try {
    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);
    console.log("Upload success:", res.data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
  }
};

export default upload;
