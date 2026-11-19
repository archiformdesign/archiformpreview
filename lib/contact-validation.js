// Shared by the contact form and its API; contains no server configuration.
export const CONTACT_TYPES = ['Villa', 'Family home', 'Apartment', 'Renovation', 'Other'];
const LIMITS = { name: 120, email: 200, phone: 40, message: 4000 };
const controls = /[\u0000-\u001f\u007f]/;

export function normalizeContact(body) {
  return Object.fromEntries([...Object.keys(LIMITS), 'type'].map((key) => [
    key, typeof body?.[key] === 'string' ? body[key].trim() : '',
  ]));
}

export function validateContact(data) {
  const errors = {};
  if (!data.name) errors.name = 'Enter your name.';
  if (!data.email) errors.email = 'Enter your email address.';
  else if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/i.test(data.email)
    || data.email.split('@')[0].length > 64 || /(^\.|\.$|\.\.)/.test(data.email.split('@')[0])) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }
  const digits = data.phone.replace(/\D/g, '');
  const unbalanced = /[()]/.test(data.phone.replace(/\([0-9 ]+\)/g, ''));
  if (!data.phone) errors.phone = 'Enter your phone number, including the country code.';
  else if (unbalanced || !/^\+?[0-9][0-9 ().-]*[0-9)]$/.test(data.phone) || digits.length < 7 || digits.length > 15 || /^0+$/.test(digits)) {
    errors.phone = 'Enter a valid phone number with 7–15 digits; a country code beginning with + is accepted.';
  }
  if (!CONTACT_TYPES.includes(data.type)) errors.type = 'Choose a property type.';
  if (!data.message) errors.message = 'Tell us a little about what’s on your mind.';
  for (const [key, max] of Object.entries(LIMITS)) {
    if (data[key].length > max) errors[key] = `Use no more than ${max} characters.`;
    const value = key === 'message' ? data[key].replace(/[\r\n\t]/g, '') : data[key];
    if (controls.test(value)) errors[key] = 'Remove unsupported control characters.';
  }
  return errors;
}
