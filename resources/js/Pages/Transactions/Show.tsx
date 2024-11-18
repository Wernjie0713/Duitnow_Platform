import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    // Include any other fields for the user object
}

// Define the types for the transaction properties in usePage().props
interface TransactionProps{
    auth: {
        user: User;
    };
    reference_id: string;
    date: string; // Use Date if it's a date object
    amount: string | number;
    transaction_type: string;
    image_url: string;
    [key: string]: any; // Index signature to allow additional properties
}

export default function ShowTransaction({ isAdmin }: { isAdmin: boolean }) {
    // Cast the props from usePage to TransactionProps
    const { auth, reference_id, date, amount, transaction_type, image_url } = usePage<TransactionProps>().props;
    const user = auth.user;


    // Inertia.js form setup to submit confirmed data
    const { post, processing } = useForm({
        reference_id,
        date,
        amount,
        transaction_type,
        image_url
    });

    // Handle form submission (confirmation)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Submit the form to the confirm route to save the transaction
        post(route('transactions.confirm'), {
            onSuccess: () => {
                alert("Transaction confirmed and saved successfully!");
                window.location.href = "/transactions"; // Redirect to transactions page after saving
            },
            onError: (errors) => {
                console.error('Failed to save transaction:', errors);
                // Collect error messages and alert them
                const errorMessages = Object.values(errors).flat().join('\n'); // Combine all errors into one string
                alert(`Failed to save transaction:\n${errorMessages}`);
                window.location.href = "/transactions";
            }
        });
    };

    return (
        <AuthenticatedLayout isAdmin={isAdmin} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Extracted Transaction Data</h2>}>
            <Head title="Extracted Transaction Data" />
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit}>
                        {transaction_type && (
                            <div className="mb-4">
                                <label className="font-semibold block">Transaction Type:</label>
                                <p className="text-sm sm:text-base">{transaction_type}</p>
                                <input type="hidden" name="image_url" value="{{ image_url }}" />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="font-semibold block">Reference ID:</label>
                            <p className="text-sm sm:text-base">{reference_id}</p>
                        </div>

                        <div className="mb-4">
                            <label className="font-semibold block">Date:</label>
                            <p className="text-sm sm:text-base">{date}</p>
                        </div>

                        <div className="mb-4">
                            <label className="font-semibold block">Amount:</label>
                            <p className="text-sm sm:text-base">{amount}</p>
                        </div>

                        {/* Buttons container */}
                        <div className="flex space-x-4">
                            {/* First button inside the form */}
                            <Button
                                className="text-white py-2 px-4 rounded"
                                disabled={processing}
                            >
                                Confirm and Save
                            </Button>
                        </div>
                    </form>
                    {/* Second button outside the form but aligned with the first */}
                    <Button variant="destructive" className="text-white py-2 px-4 rounded mt-2">
                        <a href="/transactions" className="text-white block text-center">
                            Cancel and Back to Transactions
                        </a>
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
