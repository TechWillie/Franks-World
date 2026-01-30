// UploadFile.jsx
import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function UploadFile({
  folder = "web-uploads",
  accept = "image/*",
  maxMB = 10,
  onUploaded,

  // ✅ NEW (optional) callbacks — won’t affect your user photo flow if you don’t pass them
  onUploadStart,
  onUploadEnd,
  onPickFile,
  onError,
}) {
  const [file, setFile] = useState(null);
  const [pct, setPct] = useState(0);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");

  const onPick = (e) => {
    setErr("");
    setUrl("");
    setPct(0);

    const f = e.target.files?.[0];
    if (!f) return;

    const maxBytes = maxMB * 1024 * 1024;
    if (f.size > maxBytes) {
      setFile(null);
      const msg = `File too large. Max ${maxMB}MB.`;
      setErr(msg);
      onError?.(new Error(msg));
      return;
    }

    setFile(f);
    onPickFile?.(f); // ✅ tells parent a file was selected
  };

  const onUpload = async () => {
    if (!file) return;

    try {
      onUploadStart?.(); // ✅ parent can disable submit immediately

      setErr("");
      setUrl("");
      setPct(0);

      const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
      const path = `${folder}/${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}${ext ? "." + ext : ""}`;

      const storageRef = ref(storage, path);

      const task = uploadBytesResumable(storageRef, file, {
        contentType: file.type || undefined,
      });

      const downloadUrl = await new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            setPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          },
          reject,
          async () => resolve(await getDownloadURL(task.snapshot.ref))
        );
      });

      // ✅ show preview
      setUrl(downloadUrl);

      // ✅ notify parent (this is your existing logic)
      const payload = {
        url: downloadUrl,
        storagePath: path,
        folder,
        contentType: file.type,
        sizeBytes: file.size,
        originalName: file.name,
      };

      onUploaded?.(payload);
      onUploadEnd?.(payload); // ✅ parent knows upload+preview is ready
    } catch (e) {
      console.error("❌ Upload error:", e);
      setErr(e?.message || String(e));
      onError?.(e);
      onUploadEnd?.(null); // ✅ end even on error
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h3 style={{ margin: 0 }}>Please upload Image</h3>

      <input type="file" accept={accept} onChange={onPick} />

      <button onClick={onUpload} disabled={!file}>
        Upload {pct ? `(${pct}%)` : ""}
      </button>

      {err ? <div style={{ color: "crimson" }}>Error: {err}</div> : null}

      {url ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, wordBreak: "break-all" }}>{url}</div>
          <img
            src={url}
            alt="upload preview"
            style={{ width: "50%", borderRadius: 15 }}
          />
        </div>
      ) : null}
    </div>
  );
}
