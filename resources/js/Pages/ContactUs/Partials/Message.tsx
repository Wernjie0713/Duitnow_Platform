import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

dayjs.extend(relativeTime);

export default function Message({ message, isAdmin }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        comment: '',
    });

    const submitComment = (e) => {
        e.preventDefault();
        post(route('contactus.comments.store', message.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="p-6 flex flex-col space-y-4">
            <div className="flex space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 -scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gray-800">{message.user.name} </span>
                            <span className="text-gray-800">{message.user.phone_no}</span>
                            <small className="ml-2 text-sm text-gray-600">{dayjs(message.created_at).fromNow()}</small>
                        </div>
                    </div>
                    <p className="mt-4 text-lg text-gray-900">{message.message}</p>
                </div>
            </div>

            {message.comments.length > 0 && (
                <div className="mt-4 bg-gray-100 rounded-lg p-4">
                    <h3 className="font-semibold">Comments</h3>
                    {message.comments.map((comment) => (
                        <div key={comment.id} className="mt-2 border-t pt-2">
                            <span className="text-gray-800">{comment.user.name}:</span>
                            <p>{comment.comment}</p>
                            <small className="text-sm text-gray-600">{dayjs(comment.created_at).fromNow()}</small>
                        </div>
                    ))}
                </div>
            )}

            {isAdmin && (
                <form onSubmit={submitComment} className="mt-4">
                    <textarea
                        value={data.comment}
                        placeholder="Write a comment..."
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData('comment', e.target.value)}
                    ></textarea>
                    {errors.comment && <p className="text-red-500 mt-2 text-sm">{errors.comment}</p>}
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="mt-4"
                    >
                        Reply
                    </PrimaryButton>
                </form>
            )}
        </div>
    );
}
