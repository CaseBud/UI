import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

/**
 * Component for displaying translated text
 * @param {Object} props - Component props
 * @param {string} props.id - Translation key
 * @param {string} props.defaultMessage - Default message if translation not found
 * @param {Object} props.values - Values to interpolate in the translated text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML element to render as (default: span)
 * @returns {React.ReactElement} Translated text element
 */
const TranslatedText = ({ 
    id, 
    defaultMessage, 
    values = {}, 
    className = '', 
    as: Component = 'span',
    ...rest 
}) => {
    const { currentLanguage } = useLanguage();
    
    // Get the translation
    let text = translate(id, currentLanguage) || defaultMessage || id;
    
    // Replace placeholders with values if provided
    if (values && Object.keys(values).length > 0) {
        Object.entries(values).forEach(([key, value]) => {
            text = text.replace(new RegExp(`{${key}}`, 'g'), value);
        });
    }
    
    return (
        <Component className={className} {...rest}>
            {text}
        </Component>
    );
};

export default TranslatedText; 