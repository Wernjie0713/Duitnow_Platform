import UploadTransactionForm from './Partials/UploadTransactionForm';
import Transaction from './Partials/Transaction';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth, transactions, isAdmin }) { 
    return (
        <AuthenticatedLayout isAdmin={isAdmin} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transaction</h2>}>
            <Head title="Transaction" />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Upload Transaction Form */}
                <div className='flex flex-col sm:flex-row justify-end sm:mb-4 gap-4'>
                    <UploadTransactionForm />
                </div>
                
                {/* Transaction Table */}
                <div className='mt-4'>
                    <Transaction transactions={transactions.data} links={transactions.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
