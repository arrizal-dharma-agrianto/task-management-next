import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { uploadFile } from "@/service/upload";
import { postAttachment } from "@/service/task";
import { toast } from "sonner";
import { Loading } from "./ui/loading";
import { Download } from "lucide-react";

export default function TaskDetailAttachment({ role, attachment, taskId }:
  { attachment: any[], taskId: string, role: string }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentList, setAttachmentList] = useState(attachment);

  function handleAddClick() {
    setOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    setIsLoading(true);
    e.stopPropagation();
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", formData, file);

    try {
      const upload = await uploadFile(formData, fileName, taskId);
      if (!upload) {
        console.error("Failed to upload file, no URL returned");
        toast.error("Failed to upload file");
        return;
      }

      const response = await postAttachment({
        url: upload.url,
        size: upload.size,
        taskId,
        fileName,
      });


      if (!response) {
        console.error("Failed to post attachment, no response received");
        toast.error("Failed to add attachment");
        return;
      }

      toast.success("Attachment added successfully");
      setAttachmentList((prev) => [...prev, response]);
    } catch (err) {
      console.error("Upload failes:", err);
      toast.error("Failed to add attachment");
    } finally {
      setIsLoading(false);
      setOpen(false);
      setFileName("");
      setFile(null);
    }


  }
  return (
    <div className="flex gap-3 mt-5">
      {/* Add Attachment Box */}
      {(role === "ADMIN" || role === "OWNER") &&
        <button
          className="flex flex-col items-center justify-center w-24 h-32 rounded-md border border-dashed border-muted-foreground hover:bg-muted transition"
          onClick={handleAddClick}
          type="button"
        >
          <span className="text-3xl text-muted-foreground">+</span>
          <span className="mt-2 text-xs text-muted-foreground">Add</span>
        </button>
      }

      {/* Dummy Attachment Box */}
      <div className="flex gap-4 flex-wrap">
        {attachmentList.map((attachment) => (
          <div
            key={attachment.id}
            className="w-24 h-32 rounded-md border bg-card flex flex-col overflow-hidden"
          >
            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-2xl">📄</span>
            </div>

            {/* Info Area */}
            <div className="flex items-center justify-between px-2 py-1 bg-background border-t">
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[60px]" title={attachment.fileName}>
                  {attachment.fileName}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {attachment.size ?? '-'}
                </span>
              </div>

              <a
                href={attachment.url}
                target="_blank"
                // rel="noopener noreferrer"
                className="p-1 rounded hover:bg-muted transition"
                title="Unduh"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <DialogHeader>
              <DialogTitle>Add Attachment</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block text-sm mb-1">File Name</label>
              <Input
                value={fileName}
                onChange={handleNameChange}
                placeholder="Masukkan nama file"
                required
              />
            </div>
            <div>
              <Label className="block text-sm mb-1">File</Label>
              <Input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <DialogFooter>
              <Button disabled={isLoading} type="submit">{isLoading ? <Loading /> : 'Save'}</Button>
              <DialogClose asChild>
                <Button disabled={isLoading} type="button" variant="outline">Batal</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
