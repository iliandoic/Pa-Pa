// clx - className utility (replaces @medusajs/ui clx)
// Combines class names and filters out falsy values

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function clx(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = clx(...input)
      if (inner) classes.push(inner)
    }
  }

  return classes.join(" ")
}

export default clx
