type ButtonProps = {
  text?: string
}

export function Button({ text = "Texto default" } : ButtonProps) {
  return (
    <button>{text}</button>
  )
}