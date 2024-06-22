import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { UploadImage } from '@/lib/actions/profileAccount.action';
import { GenerateThumbnailProps } from '@/types';

const GenerateThumbnail = ({ setImage, image }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsImageLoading(true);
    setImage('');

    try {
      const formData = new FormData();
      formData.append('profile_photo', file);

      const imgRes = await UploadImage(formData);
      if (imgRes && imgRes.fileUrl) {
        setImage(imgRes.fileUrl);
        setIsImageLoading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setIsImageLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files || files.length === 0) {
        alert('Please select a file to upload');
        return;
      }

      const file = files[0];
      handleImageUpload(file);
    } catch (error) {
      console.error('Error handling image upload:', error);
      alert('Error uploading image');
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

      {image && (
        <div className="flex-center w-full">
          <Image src={image} width={200} height={200} className="mt-5" alt="thumbnail" />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
