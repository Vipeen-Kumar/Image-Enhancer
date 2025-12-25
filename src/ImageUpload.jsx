import React, { useCallback, useRef } from "react";

const ImageUpload = ({ onFileSelect }) => {
  const inputRef = useRef(null);

  /**
   * Validates the file and passes it to the parent component.
   * @param {File | null} file - The selected file object.
   */
  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    } else {
      onFileSelect(null); // Clear if the file is not a valid image
    }
  };

  /**
   * Handles file selection from the file input dialog.
   */
  const onSelectFile = (e) => {
    handleFileChange(e.target.files?.[0]);
  };

  /**
   * Handles files dropped onto the component.
   */
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileChange(e.dataTransfer.files?.[0]);
    },
    [onFileSelect] // Dependency array ensures the callback has the latest onFileSelect
  );

  /**
   * Prevents the default browser behavior for drag-over events.
   */
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /**
   * Programmatically clicks the hidden file input.
   */
  const openFileDialog = () => inputRef.current?.click();

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? openFileDialog() : null
        }
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-400/60 bg-slate-900/30 hover:bg-slate-900/50 transition p-6 text-center"
        aria-label="Drop image here or click to browse"
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
        />
        <p className="text-slate-300">
          Drag & drop an image here, or click to browse
        </p>
        <p className="text-slate-400 text-xs mt-1">PNG, JPG, WebP</p>
      </div>
    </div>
  );
};

export default ImageUpload;
