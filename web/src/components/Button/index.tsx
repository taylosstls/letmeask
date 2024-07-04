import { ComponentProps } from "react"
import './style.css'

type ButtonProps = ComponentProps<'button'>

export function Button(props: ButtonProps) {
  return (
    <button className="button" {...props} />
  )
}