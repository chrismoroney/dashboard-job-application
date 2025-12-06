"use client";

import { useRef, useState, DragEvent } from "react";

interface FileUploaderProps {
  label?: string;
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploader({ label = "Upload materials", onFilesSelected }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const selectedFiles = Array.from(fileList);
    setFiles(selectedFiles);
    onFilesSelected(selectedFiles);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsHovering(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-100">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsHovering(true);
        }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center transition ${
          isHovering ? "border-emerald-400/60 bg-emerald-400/10" : "hover:border-cyan-300/50 hover:bg-white/10"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cyan-200 text-xs font-bold">
          UP
        </div>
        <p className="mt-3 text-sm font-medium text-slate-100">Drop files here, or click to browse</p>
        <p className="text-xs text-slate-300/80 mt-1">PDF, DOCX, images — up to 10MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <ul className="space-y-2 rounded-xl bg-white/5 p-4 text-left">
          {files.map((file) => (
            <li key={file.name} className="flex items-center gap-2 text-sm text-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
