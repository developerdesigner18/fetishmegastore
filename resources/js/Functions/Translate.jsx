export default function __(key, replacements = {}) {
  let translation = window._translations[key] || key;



    Object.keys(replacements).forEach((r) => {
        // console.log('replacements',r)
        translation = translation.replace(`:${r}`, replacements[r]);
        // console.log('translation',translation)
    });

    return translation;
}
