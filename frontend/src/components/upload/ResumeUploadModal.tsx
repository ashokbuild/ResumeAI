import React, { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, X, AlertCircle, Sparkles } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({ isOpen, onClose }) => {
  const { uploadAndAnalyze, isAnalyzing, error } = useResume();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roleInput, setRoleInput] = useState<string>('Senior Full Stack Engineer');
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    // Validate type
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setValidationError('Only PDF documents (.pdf) are supported. Please select a valid PDF file.');
      return;
    }

    // Validate size (10 MB limit)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setValidationError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed limit of 10MB.`);
      return;
    }

    if (file.size === 0) {
      setValidationError('The selected PDF file is empty (0 bytes).');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    try {
      await uploadAndAnalyze(selectedFile, roleInput);
      onClose();
    } catch {
      // Error is handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isAnalyzing}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload your resume</h2>
            <p className="text-xs text-slate-400">
              Your resume is processed securely. We do not need an account to analyze it.
            </p>
          </div>
        </div>

        {/* Target Role Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Target Job Title / Career Focus (Optional)
          </label>
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer, ML Engineer, Product Manager"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={isAnalyzing}
          />
        </div>

        {/* Dropzone */}
        {!selectedFile ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-200 mb-1">
              Drop your PDF here or browse files
            </p>
            <p className="text-xs text-slate-400">PDF files only (maximum 10MB)</p>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB • PDF
                </p>
              </div>
            </div>
            {!isAnalyzing && (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors ml-3"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Validation or API Errors */}
        {(validationError || error) && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || error}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              !selectedFile || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Decoding &amp; Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Start AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
