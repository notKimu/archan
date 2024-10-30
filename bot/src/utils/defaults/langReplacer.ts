export function langReplacer(
  message: string,
  authorName: string,
  target: string,
  ammount: string
) {
  return message
    .replace("{member}", authorName)
    .replace("{target}", target)
    .replace("{ammount}", ammount);
}
