import { draftMode } from 'next/headers'

// Ends Draft Mode (the "Exit preview" button) and returns to the same page, now showing published content.
// POST, because it changes what later requests see.
export async function POST(request) {
  ;(await draftMode()).disable()
  const to = new URL(request.url).searchParams.get('to') || '/'
  // Same-site paths only, so this can't be used to redirect anywhere else
  const path = to.startsWith('/') && !to.startsWith('//') && !to.startsWith('/\\') ? to : '/'
  return Response.redirect(new URL(path, request.url), 303)
}
