declare module 'react-phone-input-2' {
    import type * as React from 'react';

    interface PhoneInputProps {
        country?: string;
        value?: string;
        onChange?: (
            value: string,
            country: any,
            e: React.ChangeEvent<HTMLInputElement>,
            formattedValue: string,
        ) => void;
        inputClass?: string;
        buttonClass?: string;
        placeholder?: string;
        disabled?: boolean;
        [key: string]: any;
    }

    const PhoneInput: React.FC<PhoneInputProps>;
    export default PhoneInput;
}
