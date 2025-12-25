import React from "react";

const ImagePreview = ({ originalSrc, enhancedSrc, alt = "preview" }) => {
  const box = "relative w-full bg-slate-800 rounded-md overflow-hidden h-64";

  return (
    <div className="w-full max-w-5xl mx-auto pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
          <p className="text-sm text-slate-300 mb-2">Original</p>
          <div className={box}>
            {originalSrc ? (
              <img src={originalSrc} alt={`${alt} original`} className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 text-sm">No image selected</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
          <p className="text-sm text-slate-300 mb-2">Enhanced</p>
          <div className={box}>
            {enhancedSrc ? (
              <img src={enhancedSrc} alt={`${alt} enhanced`} className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 text-sm">Run enhancement to view</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
