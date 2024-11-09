import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";

export default function GuideForImage({ }) {
    return (
        <Dialog>
            <DialogTrigger className='font-medium text-sm text-blue-600'><u>Guide for Uploaded Image</u></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='mb-4'>Guide for Uploaded Image</DialogTitle>
                    <DialogDescription>
                        <img src="/images/GuideForUploadedImage.jpg" alt="Guide for Uploaded Image" className="mb-4" />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}