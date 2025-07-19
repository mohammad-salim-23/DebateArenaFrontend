import { Dispatch, SetStateAction } from "react";
import { Input } from "../../input";
import { cn } from "@/lib/utils";
import { CloudUpload } from "lucide-react";

type TImageUploaderProps = {
  setImageFile: Dispatch<SetStateAction<File | null>>;
  setImagePreview: Dispatch<SetStateAction<string>>;
  label?: string;
  className?: string;
};

const ImageUploader = ({
  label = "Upload Image",
  className,
  setImageFile,
  setImagePreview,
}: TImageUploaderProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      <Input
        onChange={handleImageChange}
        type="file"
        accept="image/*"
        className="hidden"
        id="image-uploader"
      />
      <label
        htmlFor="image-uploader"
        className="w-full h-28 gap-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition"
      >
        <CloudUpload />
        <span>{label}</span>
      </label>
    </div>
  );
};

export default ImageUploader;
