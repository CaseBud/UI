# Language Support System

This document explains how to use the language support system implemented in the CaseBud UI application.

## Overview

The language support system provides internationalization (i18n) capabilities to the application, allowing users to switch between different languages. The system is implemented entirely on the frontend with no backend dependencies.

## Key Components

1. **LanguageContext**: Manages the global language state
2. **Translations**: A utility for storing and retrieving translated text
3. **TranslatedText**: A component for easily using translations in JSX
4. **LanguageSelector**: A UI component for changing languages

## How to Use

### Adding New Translations

To add translations for new text, update the `translations.js` file:

```javascript
export const translations = {
  // Add a new translation key
  'your.new.key': {
    'en-US': 'English text',
    'es-ES': 'Spanish text',
    'fr-FR': 'French text',
    // Add translations for all supported languages
  }
};
```

### Using Translations in Components

There are three ways to use translations in your components:

1. **Using the TranslatedText Component**:

```jsx
import TranslatedText from './components/TranslatedText';

function YourComponent() {
  return (
    <div>
      <TranslatedText id="your.new.key" defaultMessage="Fallback text" />
    </div>
  );
}
```

2. **Using the translate function**:

```jsx
import { translate } from './utils/translations';
import { useLanguage } from './contexts/LanguageContext';

function YourComponent() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div>
      <button title={translate('your.new.key', currentLanguage)}>
        {translate('button.label', currentLanguage)}
      </button>
    </div>
  );
}
```

3. **Using Dynamic Values in Translated Text**:

For translations that need to include dynamic values, you can use placeholders and replace them:

```jsx
// In translations.js
'default.documentUploaded': {
  'en-US': 'Document "{name}" uploaded successfully.',
  'es-ES': 'Documento "{name}" subido con éxito.',
  // Other languages...
}

// In your component
const message = translate('default.documentUploaded', currentLanguage).replace('{name}', fileName);
```

### Default System Messages

The application includes translations for many default system messages:

- Greetings
- Error messages
- Document upload notifications
- Web search notifications
- Mode change notifications

To use these in your components, simply use the translate function with the appropriate key:

```jsx
const errorMessage = translate('default.error', currentLanguage);
const greeting = translate('default.greeting', currentLanguage);
```

### Adding New Languages

To add support for a new language:

1. Edit `src/contexts/LanguageContext.jsx` and add the new language to the `languages` array:

```javascript
export const languages = [
  // Existing languages...
  { code: 'new-lang', name: 'New Language Name', flag: '🏴' },
];
```

2. Update all translation entries in `src/utils/translations.js` to include the new language code:

```javascript
'translation.key': {
  // Existing translations...
  'new-lang': 'Translated text in new language',
},
```

## Tech Details

- Language preferences are stored in `localStorage` as 'userLanguage'
- The default language is 'en-US' if no preference is found
- The language selector component displays a flag for the currently selected language
- All components using the language context will automatically update when the language changes

## Supported Languages

Currently, the application supports the following languages:

1. English (en-US)
2. Spanish (es-ES)
3. French (fr-FR)
4. German (de-DE)
5. Chinese (zh-CN)
6. Japanese (ja-JP)
7. Korean (ko-KR)
8. Arabic (ar-SA)
9. Hindi (hi-IN)
10. Portuguese (pt-BR)
11. Yoruba (yo-NG)
12. Igbo (ig-NG)
13. Hausa (ha-NG) 