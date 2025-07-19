"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Textarea } from "../ui/textarea";
import NLButton from "../ui/core/ImageUploader/NLButton";
import { toast } from "sonner";
import { createDebate } from "@/services/DebateService/DebateService";
import ImageUploader from "../ui/core/ImageUploader";
import Image from "next/image";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";

type DebateFormProps = {
  closeModal?: () => void;
};

export default function DebateForm({ closeModal }: DebateFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
const { data: session } = useSession();
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!duration || duration <= 0) {
    toast.error("Please enter a valid duration");
    return;
  }

  // Check if user is logged in
  if (!session?.user?.token) {
    toast.error("You are not logged in");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("duration", duration.toString());
    formData.append("tags", tags);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await createDebate(formData, session.user.token);

    if (res.success) {
      toast.success("Debate created successfully!");
      if (closeModal) closeModal();
      else router.push("/all-debates");

      setTitle("");
      setDescription("");
      setCategory("");
      setDuration("");
      setTags("");
      setImageFile(null);
      setImagePreview("");
    } else {
      toast.error(res.message || "Failed to create debate");
    }
  } catch (err) {
    toast.error("Something went wrong");
    console.error(err);
  }
};
    

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-600">
        Create New Debate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
          required
        />

        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <Input
          type="number"
          placeholder="Duration (hours)"
          value={duration === "" ? "" : duration}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") setDuration("");
            else setDuration(Number(val));
          }}
          min={1}
          required
        />

        <Input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
        />

        <ImageUploader
          label="Upload Debate Image"
          setImageFile={setImageFile}
          setImagePreview={setImagePreview}
        />

        {imagePreview && (
          <div className="w-32 h-32 mt-2 relative rounded border overflow-hidden">
            <Image
              src={imagePreview}
              alt="Debate preview"
              fill
              style={{ objectFit: "cover" }}
              className="rounded"
              unoptimized
            />
          </div>
        )}

        <NLButton variant="outline" type="submit" className="w-full mt-4 hover:bg-teal-600 hover:text-white">
          Create Debate
        </NLButton>
      </form>
    </div>
  );
}
