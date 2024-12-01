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
    const text = `1. Open to all registered UTM students in Campus JB, KL, and Pagoh.
2. Transactions must be made using the DuitNow gateway.
3. Participants must have a valid DuitNow ID.
4. The top 10 transaction counts for each week will be cross-checked for verification.
5. Top 10 participants with the highest transaction counts during each week will be rewarded.
6. To be eligible for prizes, a minimum of 50 transactions must be completed within a week.
7. Winners will be announced within 5 working days after the end of each weekly prize period.
8. Prizes are non-transferable and cannot be exchanged for cash.
9. DuitNow reserves the right to disqualify any participant suspected of fraudulent activity.
10. Participants agree to allow DuitNow to collect, process, and use their personal data for program purposes, including promotional activities, in accordance with the applicable privacy policy.
11. DuitNow reserves the right to modify, suspend, or terminate this program at any time by providing prior notice, where applicable.
12. DuitNow is not responsible for technical failures, transaction delays, or any issues arising from factors beyond its control.`;


    const lines = text.split('\n').map(line => line.trim());

    return (
        <Dialog>
            <DialogTrigger className='font-medium'>Terms and Condition</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Terms and Condition</DialogTitle>
                    <DialogDescription className='text-left'>
                        {lines.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
