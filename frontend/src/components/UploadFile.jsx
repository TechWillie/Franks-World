// UploadFile.jsx (PREVIEW ONLY - NO FIREBASE UPLOAD)
import { useEffect, useState } from "react";

export default function UploadFile({
  accept = "image/*",
  maxMB = 10,
  onPickFile, // parent gets the File
  onError,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onPick = (e) => {
    setErr("");
    setPreviewUrl("");

    const f = e.target.files?.[0];
    if (!f) return;

    const maxBytes = maxMB * 1024 * 1024;
    if (f.size > maxBytes) {
      const msg = `File too large. Max ${maxMB}MB.`;
      setErr(msg);
      onError?.(new Error(msg));
      onPickFile?.(null);
      return;
    }

    // ✅ instant local preview
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    // ✅ send file up to Signup
    onPickFile?.(f);
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h3 style={{ margin: 0 }}>Profile Image</h3>

      <input type="file" accept={accept} onChange={onPick} />

      {err ? <div style={{ color: "crimson" }}>Error: {err}</div> : null}

      {previewUrl ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12 }}>Preview (not uploaded yet)</div>
          <img
            src={previewUrl}
            alt="local preview"
            style={{ width: "50%", borderRadius: 15 }}
          />
        </div>
      ) : null}
    </div>
  );
}