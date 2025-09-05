"use client";
import React from "react";

export default function PreviewModal({
  open, onClose, original, suggestion, format, onConfirm
}: {
  open: boolean; onClose: () => void;
  original: string; suggestion: string; format: "text" | "html";
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-full ring-1 ring-brand-100">
        <div className="px-4 py-3 border-b border-brand-100 font-medium bg-brand-50/60">Preview: Original vs AI Suggestion</div>
        <div className="p-4 grid grid-cols-2 gap-4 max-h-[60vh] overflow-auto">
          <div>
            <div className="text-xs text-brand-700 mb-1">Original</div>
            <div className="border border-brand-200 rounded p-3 whitespace-pre-wrap bg-white">{original}</div>
          </div>
          <div>
            <div className="text-xs text-brand-700 mb-1">AI Suggestion</div>
            <div className="border border-brand-200 rounded p-3 bg-white">
              {format === "html" ? <div dangerouslySetInnerHTML={{ __html: suggestion }} /> : <pre className="whitespace-pre-wrap">{suggestion}</pre>}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-brand-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border border-brand-200 rounded text-brand-700 hover:bg-brand-50">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-700 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}
