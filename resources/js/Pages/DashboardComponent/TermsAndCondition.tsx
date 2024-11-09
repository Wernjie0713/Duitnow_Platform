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

export default function TermsAndCondition({ }) {
    const text = `1. Open to all registered UTM students in Campus JB, KL and Pagoh
                2. Transactions must be made using the DuitNow gateway
                3. Participants must have a valid DuitNow ID
                4. The top 10 transaction counts will be cross-checked for verification
                5. Winners will be announced within 5 working days of each prize period
                6. Prizes are non-transferable and cannot be exchanged for cash
                7. DuitNow reserves the right to disqualify any participant suspected of fraudulent activity
                8. Participants agree to allow DuitNow to collect, process, and use their personal data for program purposes, including promotional activities, in accordance with the applicable privacy policy.
                9. DuitNow reserves the right to modify, suspend, or terminate this program at any time by providing prior notice, where applicable.
                10. DuitNow is not responsible for technical failures, transaction delays, or any issues arising from factors beyond its control.`;

    const lines = text.split('\n').map(line => line.trim());

    return (
        <Dialog>
            <DialogTrigger className='font-medium'>Terms and Condition</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Terms and Condition</DialogTitle>
                    <DialogDescription>
                        {lines.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}