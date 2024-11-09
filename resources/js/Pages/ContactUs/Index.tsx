import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, Head } from '@inertiajs/react';
import Message from './Partials/Message';
 
export default function Index({ auth, messages, adminMessages, isAdmin }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });
 
    const submit = (e) => {
        e.preventDefault();
        post(route('contactus.store'), { onSuccess: () => reset() });
    };
 
    return (
        <AuthenticatedLayout isAdmin={isAdmin}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Contact Us</h2>}
            >
            <Head title="Contact Us" />
 
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                {!isAdmin && (
                    <form onSubmit={submit}>
                        <textarea
                            value={data.message}
                            placeholder="Please describe the issue you are facing in detail."
                            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                            onChange={e => setData('message', e.target.value)}
                        ></textarea>
                        <InputError message={errors.message} className="mt-2" />
                        <PrimaryButton className="mt-4" disabled={processing}>Send</PrimaryButton>
                    </form>
                )}

                {!isAdmin && (
                    <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                        {messages.map(message =>
                            <Message key={message.id} message={message} />
                        )}
                    </div>
                )}

                {isAdmin && (
                    <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
                        {adminMessages.map(message =>
                            <Message key={message.id} message={message} />
                        )}
                    </div>
                )}

                {isAdmin && adminMessages.length === 0 && (
                    <div className="mt-6 text-center text-gray-500">
                        There are no messages yet.
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}