"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { updateUser } from "@/lib/actions/user.action";
import { UploadImage } from "@/lib/actions/profileAccount.action";

interface Props {
    user: {
        id: string;
        objectId: string;
        name: string;
        username: string;
        email:string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [file, setFile] = useState<File | null>(null);

    const form = useForm<any>({
        defaultValues: {
            profile_photo: user?.image ? user.image : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            email: user?.email?user?.email:"",
            bio: user?.bio ? user.bio : "",
        },
    });

    const onSubmit = async (values: any) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("bio", values.bio);

        if (file) {
            formData.append("profile_photo", file);
            try {
                const imgRes = await UploadImage(formData);
    
                if (imgRes && imgRes.fileUrl) {
                    values.profile_photo = imgRes.fileUrl;
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        }
        
        await updateUser({
            name: values.name,
            path: pathname,
            username: values.username,
            id: user.id,
            email:values.email,
            bio: values.bio,
            imageUrl: values.profile_photo,
        });

        if (pathname === "/profile/edit") {
            router.back();
        } else {
            router.push("/");
        }
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            if (!selectedFile.type.includes("image")) return;

            setFile(selectedFile);
        }
    };

    return (
        <Form {...form}>
            <form className="flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="account-form_image-label">
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt="profile_icon"
                                        width={96}
                                        height={96}
                                        priority
                                        className="rounded-full object-contain"
                                    />
                                ) : (
                                    <Image
                                        src="/assets/profile.svg"
                                        alt="profile_icon"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                )}
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    placeholder="Add profile photo"
                                    className="account-form_image-input"
                                    onChange={(e) => {
                                        handleImage(e);
                                        if (e.target.files && e.target.files[0]) {
                                            const imageUrl = URL.createObjectURL(e.target.files[0]);
                                            field.onChange(imageUrl);
                                        }
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                        <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                        <FormControl>
                            <Input type="text" className="account-form_input no-focus" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="username" render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                        <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
                        <FormControl>
                            <Input type="text" className="account-form_input no-focus" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                        <FormLabel className="text-base-semibold text-light-2">
                            Bio
                        </FormLabel>
                        <FormControl>
                            <Textarea
                                rows={5}
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" className="bg-primary-500">
                    {btnTitle}
                </Button>
            </form>
        </Form>
    );
};

export default AccountProfile;
