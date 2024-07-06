import { ComponentProps } from 'react';
import './style.css';

type ButtonProps = ComponentProps<'button'> & {
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
  return <button className={`button ${isOutlined && 'outlined'}`} {...props} />;
}
