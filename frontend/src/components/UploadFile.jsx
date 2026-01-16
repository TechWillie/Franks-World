import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function UploadFile({ folder = "web-uploads" }) {
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
    setFile(f);
  };

  async function saveUploadToBackend({ folder, path, downloadUrl, contentType, size }) {
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ If you use cookie auth / CSRF, uncomment this:
      // credentials: "include",
      body: JSON.stringify({
        folder,
        path,
        url: downloadUrl,
        contentType,
        size,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Backend save failed (${res.status}): ${text || res.statusText}`
      );
    }

    return await res.json();
  }

  const onUpload = async () => {
    if (!file) return;

    try {
      setErr("");
      setUrl("");
      setPct(0);

      // keep extension (helps previews)
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

      // ✅ Save the download URL to your backend DB
      const savedRow = await saveUploadToBackend({
        folder,
        path,
        downloadUrl,
        contentType: file.type || null,
        size: file.size || null,
      });

      console.log("✅ Saved upload in DB:", savedRow);

      // ✅ still show image preview
      setUrl(downloadUrl);
    } catch (e) {
      setErr(e?.message || String(e));
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h3 style={{ margin: 0 }}>Upload to Firebase Storage</h3>

      <input type="file" accept="image/*" onChange={onPick} />

      <button onClick={onUpload} disabled={!file}>
        Upload {pct ? `(${pct}%)` : ""}
      </button>

      {err ? <div style={{ color: "crimson" }}>Error: {err}</div> : null}

      {url ? (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, wordBreak: "break-all" }}>{url}</div>
          <img src={url} style={{ width: "100%", borderRadius: 12 }} />
        </div>
      ) : null}
    </div>
  );
}
