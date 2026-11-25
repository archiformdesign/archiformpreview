// https://www.sanity.io/docs/structure-builder-cheat-sheet
// Mirrors the website navigation: Home Page, About Us, Portfolio, Journal, Services, Contact Us.

// One-of-a-kind documents, each opened directly at a fixed document ID
export const singletonTypes = new Set(['homePage', 'aboutPage', 'contactPage'])

// Types placed explicitly below; any other type added later still appears at the end
const placedTypes = new Set(['homePage', 'aboutPage', 'project', 'journal', 'service', 'contactPage'])

const singleton = (S, typeName, title) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .schemaType(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title))

export const structure = (S) => {
  const otherTypes = S.documentTypeListItems().filter((item) => !placedTypes.has(item.getId()))

  return S.list()
    .title('Content')
    .items([
      singleton(S, 'homePage', 'Home Page'),
      singleton(S, 'aboutPage', 'About Us'),
      S.listItem()
        .title('Portfolio')
        .id('portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([S.documentTypeListItem('project').title('Projects')]),
        ),
      S.documentTypeListItem('journal').title('Journal'),
      S.documentTypeListItem('service').title('Services'),
      singleton(S, 'contactPage', 'Contact Us'),
      ...(otherTypes.length ? [S.divider(), ...otherTypes] : []),
    ])
}
