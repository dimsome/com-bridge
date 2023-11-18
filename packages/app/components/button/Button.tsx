import React, {forwardRef, ReactNode} from "react";
import clsxm from "@/src/lib/clsxm";
import {ImSpinner2} from "react-icons/im";


type ButtonProps = {
    isLoading?: boolean;
    isDarkBg?: boolean;
    variant?: 'primary' | 'CTA';
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
} & React.ComponentPropsWithRef<'button'>;


const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            disabled: buttonDisabled,
            isLoading,
            variant = 'primary',
            isDarkBg = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            ...rest
        },
        ref
    ) => {
        const disabled = isLoading || buttonDisabled;

        return (
            <button
                ref={ref}
                type='button'
                disabled={disabled}
                className={clsxm(
                    'inline-flex items-center rounded-full font-medium',
                    'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
                    'shadow-sm',
                    'transition-colors duration-75',
                    'px-3 py-1.5',
                    'text-center text-sm md:text-base',
                    //#region  //*=========== Variants ===========
                    [
                        variant === 'primary' && [
                            'bg-primary-500 text-white',
                            'border-primary-600 border',
                            'hover:bg-primary-600 hover:text-white',
                            'active:bg-back',
                            'disabled:bg-primary-700 disabled:opacity-40',
                        ],
                        variant === 'CTA' && [
                            'px-8 py-3',
                            'bg-primary-500 text-white',
                            'border-transparent border',
                            'hover:border-pink-500 hover:text-white',
                            'active:bg-primary-300',
                            'disabled:bg-primary-500 disabled:opacity-40',
                        ],
                    ],
                    //#endregion  //*======== Variants ===========
                    'disabled:cursor-not-allowed',
                    isLoading &&
                    'relative !text-transparent transition-none hover:text-transparent disabled:cursor-wait',
                    className
                )}
                {...rest}
            >
                {isLoading && (
                    <div
                        className={clsxm(
                            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                            'text-white',
                            {
                                'text-black': ['flat'].includes(variant) && !isDarkBg,
                                'text-primary-500': ['outline', 'text'].includes(variant),
                            }
                        )}
                    >
                        <ImSpinner2 className='animate-spin' />
                    </div>
                )}
                {LeftIcon}
                <span className="grow">
                    {children}
                </span>
                {RightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
