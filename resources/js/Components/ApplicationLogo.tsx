import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/images/Logo2.png" alt="Logo" className="w-max h-max" {...props} />
    );
}
