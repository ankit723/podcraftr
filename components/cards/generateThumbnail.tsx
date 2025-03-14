import React, { useRef, useState } from 'react';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { UploadImage } from '@/lib/actions/profileAccount.action';
import { GenerateThumbnailProps } from '@/types';

/**
 * Component for uploading and displaying podcast thumbnail images
 */
const GenerateThumbnail = ({ setImage, image }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the image upload process
   * @param file - The file to upload
   */
  const handleImageUpload = async (file: File) => {
    setIsImageLoading(true);
    setImage('');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('profile_photo', file);

      const imgRes = await UploadImage(formData);
      if (imgRes && imgRes.fileUrl) {
        setImage(imgRes.fileUrl);
      } else {
        setError('Failed to upload image: No URL returned');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsImageLoading(false);
    }
  };

  /**
   * Handles the file input change event
   * @param e - The change event
   */
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        setError('Please select a file to upload');
        return;
      }

      const file = files[0];
      handleImageUpload(file);
    } catch (error) {
      console.error('Error handling image upload:', error);
      setError('Error uploading image. Please try again.');
    }
  };

  return (
    <>
      <div className="image_div" onClick={() => imageRef?.current?.click()}>
        <Input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={(e) => uploadImage(e)}
          accept="image/*"
        />

        {!isImageLoading ? (
          <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
        ) : (
          <div className="text-16 flex-center font-medium text-white-1">
            Uploading
            <Loader size={20} className="animate-spin ml-2" />
          </div>
        )}
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
          <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}

      {image && (
        <div className="flex-center w-full">
          <Image src={image} width={200} height={200} className="mt-5" alt="thumbnail" />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
