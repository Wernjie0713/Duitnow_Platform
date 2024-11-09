import * as React from "react"
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Link, useForm, usePage } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import { FormEventHandler } from 'react';
import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { ChangeEvent } from 'react';
import { useState } from "react";
import GuideForImage from "./GuideForImage";

export default function UpdateProfileInformation(){
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        image_url: null,
    });

    const [isOpen, setIsOpen] = useState(false);

    // Handle file change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('image_url', e.target.files[0]); // Store the selected file
        }
    };

    // Handle form submission
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData();
        // formData.append('user_id', data.user_id);
        // formData.append('reference_number', data.reference_id);
        // formData.append('date', data.date);
        // formData.append('amount', data.amount);
        formData.append('image_url', data.image_url); // Append file to formData

         // Post the image to the server and extract text
        post(route('transactions.store'), {
            onSuccess: () => {
                // Reset the form after successful upload
                reset('image_url');
                setIsOpen(false);
                alert("Image uploaded successfully! Extracted text will be shown.");
            },
            onError: (errors) => {
                console.error('Transaction upload failed:', errors);
                alert("Failed to upload the transaction. Please try again.");
            }
        });
    };
    
    return(
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild >
                    <Button onClick={() => setIsOpen(true)}>+ Upload Transaction</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Transaction</DialogTitle>
                        <DialogDescription>
                            Please upload your transaction <b className="font-bold"><u>image</u></b>. The relevant details will be extracted automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <InputLabel htmlFor="image_url" value="Proof of Transaction" />
                                
                                <Input
                                    type="file"
                                    id="image_url"
                                    name="image_url"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-[280px]"
                                    required
                                />
                            </div>
                            {errors.image_url!=null
                                &&
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <p></p>
                                    <InputError message={errors.image_url} className="col-span-3"/>
                                </div>
                            }
                        </div>
                        
                    <GuideForImage />

                        <DialogFooter>
                            <Button type="submit">Upload</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
    );
}