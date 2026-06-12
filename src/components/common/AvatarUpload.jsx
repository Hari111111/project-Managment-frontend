import { useState, useEffect } from "react";

function AvatarUpload({ value, onChange, onFileChange, label = "Profile Picture" }) {
  const [previewUrl, setPreviewUrl] = useState(value);
  const [uploadMode, setUploadMode] = useState("url");
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const backendBase = apiBase.replace("/api", "");
    return `${backendBase}${url}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Notify parent about file
      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const handleUrlChange = (url) => {
    setError("");
    setPreviewUrl(url);
    onChange(url);
    if (onFileChange) {
      onFileChange(null); // Clear file when using URL
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="label m-0 flex-1">Profile Picture</label>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded transition ${
              uploadMode === "url"
                ? "bg-brand-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
            }`}
            onClick={() => setUploadMode("url")}
            type="button"
          >
            URL
          </button>
          <button
            className={`px-3 py-1 text-sm rounded transition ${
              uploadMode === "upload"
                ? "bg-brand-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
            }`}
            onClick={() => setUploadMode("upload")}
            type="button"
          >
            Upload
          </button>
        </div>
      </div>

      {uploadMode === "url" ? (
        <input
          className="input"
          placeholder="Paste image URL here"
          value={value}
          onChange={(event) => handleUrlChange(event.target.value)}
        />
      ) : (
        <div className="space-y-2">
          <input accept="image/*" onChange={handleFileChange} type="file" className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-brand-100 file:text-brand-700 hover:file:bg-brand-200" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {previewUrl && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <img
            alt="Profile preview"
            className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover dark:border-slate-700"
            src={getImageUrl(previewUrl)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">Preview</p>
        </div>
      )}
    </div>
  );
}

export default AvatarUpload;
