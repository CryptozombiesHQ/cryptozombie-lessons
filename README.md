# CryptoZombies - Content Localization

This repository is used to translate CryptoZombies to other languages.

The source content that should be used for all translations is in the `en` directory.

```
en/
  1/ - content of Lesson 1
  ...
  N/ - content of Lesson N
  index.json - strings used in the UI
  share-template-msgs.json - strings used on the share page
```

Strings in `index.json` and `share-template-msgs.json` can contain parameters,
these will be injected before the strings are displayed to the user. Parameters
that are present in the source strings may appear in any position in the
translated strings, or omitted entirely if it makes sense to do so.

>NOTE: The syntax used to represent parameters differs between the two `.json`
>      files. In `index.json` parameters are specified using `{parameterName}`,
>      while in `share-template-msgs.json` parameters are specified using
>      `{{ .ParameterName }}`.

## Localizing for a new language
1. Create a new branch off `master`.
2. Create a new folder named after the locale code, e.g. `jp` (for Japanese), `zh` (for Chinese).
3. Translate the content.
4. Add `index.ts` to the new folder.
5. Update `index.ts` in the root folder.
6. Submit a PR against `master`.

## Fixing Source Content or Localized Content
1. Create a new branch off `master`.
2. Fix fix fix.
3. Submit a PR against `master`.



## License

Contributors must assign copyright back to Loom Network for any contributions they make.
Loom Network retains ownership of any derivative work created from original content.