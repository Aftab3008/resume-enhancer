"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { evaluateResume } from "@/lib/actions/evaluate.actions";
import { AlertTriangleIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function AddResume() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const handleFileUpload = (files: File[]) => {
    try {
      setFiles(files);
      setError(null);
      console.log(files);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    }
  };

  const handleSubmit = async () => {
    try {
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        setError(null);
        setLoading(true);
        await evaluateResume(formData);
        setIsOpened(false);
      } else {
        setError("Please upload a file");
      }
    } catch (error) {
      setError("Error occured while uploading file , please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end">
      <Button
        onClick={() => setIsOpened(true)}
        className="primary cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Resume
      </Button>
      <Dialog
        open={isOpened}
        onOpenChange={() => {
          setIsOpened(false);
          setError(null);
          setFiles([]);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Your Resume</DialogTitle>
            <FileUpload onChange={handleFileUpload} />
            {error && (
              <div className="flex items-center space-x-2 pl-3">
                <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p>Submitting...</p>
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
