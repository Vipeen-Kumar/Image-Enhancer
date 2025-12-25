import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import Loading from "./Loading";

const Home = () => {
  const [file, setFile] = useState(null);
  const [originalSrc, setOriginalSrc] = useState("");
  const [enhancedSrc, setEnhancedSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const box = "relative w-full bg-slate-800 rounded-md overflow-hidden h-64";

  const handleEnhanceImage = async () => {
    if (!file) return;

    setIsLoading(true);
    setEnhancedSrc("");
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/api/enhance", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to enhance image.");
      }

      const imageBlob = await response.blob();
      const enhancedUrl = URL.createObjectURL(imageBlob);
      setEnhancedSrc(enhancedUrl);

    } catch (err) {
      console.error(err);
      // Provide a more helpful error message
      setError(err.message.includes("Failed to fetch") 
        ? "Connection failed: Is the server running?" 
        : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onFileSelect = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setOriginalSrc(URL.createObjectURL(selectedFile));
      // Clean up previous results when a new image is selected
      setEnhancedSrc("");
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setOriginalSrc("");
    setEnhancedSrc("");
    setError("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* --- Left Side: Conditional Upload/Preview --- */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3 flex flex-col items-center justify-center min-h-[200px]">
          {originalSrc ? (
            <div className="w-full text-center">
              <p className="text-sm text-slate-300 mb-2">Your Image</p>
              <img src={originalSrc} alt="Original preview" className="mx-auto max-h-48 rounded-lg object-contain" />
              <button 
                onClick={handleRemoveImage} 
                className="mt-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <ImageUpload onFileSelect={onFileSelect} />
          )}
        </div>

        {/* --- Right Side: Enhanced Image Preview --- */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-3">
          <p className="text-sm text-slate-300 mb-2 text-center md:text-left">Enhanced</p>
          <div className={box}>
            {isLoading ? (
              <Loading />
            ) : error ? (
              <div className="flex h-full items-center justify-center text-red-400 text-sm p-4 text-center">{error}</div>
            ) : enhancedSrc ? (
              <img src={enhancedSrc} alt="Enhanced preview" className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 text-sm text-center">
                AI-powered result will appear here
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhance Button */}
      <div className="text-center">
        <button
          onClick={handleEnhanceImage}
          disabled={!file || isLoading}
          className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          {isLoading ? "Enhancing..." : "Enhance Image"}
        </button>
      </div>
    </div>
  );
};

export default Home;

