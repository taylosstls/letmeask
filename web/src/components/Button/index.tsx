import { ButtonHTMLAttributes } from "react"
import './style.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return (
    <button className="button" {...props} />
  )
}