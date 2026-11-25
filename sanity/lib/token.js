/**
 * Viewer (read-only) API token, used only to show unpublished drafts in Draft Mode. Never give this a NEXT_PUBLIC_ prefix:
 * it stays on the server, and the Presentation tool already runs with the editor's own Studio login.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || ''
