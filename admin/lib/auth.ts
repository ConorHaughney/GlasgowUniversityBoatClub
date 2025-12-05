// Admin email whitelist
export const ALLOWED_ADMIN_EMAILS = [
  'secretary-boats@gusa.gla.ac.uk',
  'captain-boats@gusa.gla.ac.uk',
  'treasurer-boats@gusa.gla.ac.uk',
  'welfare-boats@gusa.gla.ac.uk',
  'gubcpresident1867@gmail.com',
]

export const isAllowedAdmin = (email: string): boolean => {
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())
}
