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
                    6. To be eligible for prizes:
                    - A minimum of 80 transactions is required for Top 3 positions.
                    - A minimum of 40 transactions is required for positions 4 to 10.
                     7. Top 3 winners are subject to the following rules:
                    - A Top 3 winner can only achieve a position in subsequent weeks that is greater than their previous position (e.g., a 3rd place winner can be rewarded again only if they achieve 1st, 2nd, or 4 to 10 positions in a subsequent week).
                    - A participant who wins 1st place can only win 1st place once. If they achieve 1st place again in a subsequent week, they will only be eligible for prizes in positions 4 to 10.
                    - If a Top 3 winner achieves a restricted position in a subsequent week, they will automatically be moved to the 4 to 10 category for prizes.
                    8. Winners will be announced within 7 working days after the end of each weekly prize period.
                    9. Prizes are non-transferable and cannot be exchanged for cash.
                    10. DuitNow reserves the right to disqualify any participant suspected of fraudulent activity.
                    11. Participants agree to allow DuitNow to collect, process, and use their personal data for program purposes, including promotional activities, in accordance with the applicable privacy policy.
                    12. DuitNow reserves the right to modify, suspend, or terminate this program at any time by providing prior notice, where applicable.
                    13. DuitNow is not responsible for technical failures, transaction delays, or any issues arising from factors beyond its control.`;



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
