import React from 'react';
import * as cls from './index.module.scss'

type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right' | 'none';

interface ButtonProps {
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Button = ({
                           icon,
                           iconPosition = 'none',
                           children,
                           onClick,
                       }: ButtonProps) => {


    return (
        <button className={cls.button} onClick={onClick}>
            {iconPosition === 'left' && icon && (
                <span className="button__icon">{icon}</span>
            )}
            <span className="button__text">{children}</span>
            {iconPosition === 'right' && icon && (
                <span className="button__icon">{icon}</span>
            )}
        </button>
    );
};