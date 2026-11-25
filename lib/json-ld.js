/**
 * JSON for a <script type="application/ld+json"> tag. JSON.stringify leaves "<" as is, so CMS text such as a project
 * title containing "</script>" could close the tag and inject markup; "<" is the same character to a JSON parser.
 * (The Next.js JSON-LD guide recommends exactly this.)
 */
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
