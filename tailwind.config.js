/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                legal: {
                    primary: '#2563eb',
                    secondary: '#1e40af',
                    accent: '#3b82f6',
                    dark: {
                        bg: 'var(--bg-primary)',
                        card: 'var(--bg-secondary)',
                        text: 'var(--text-primary)',
                        textSecondary: 'var(--text-secondary)'
                    },
                    light: {
                        bg: 'var(--bg-primary)',
                        card: 'var(--bg-secondary)',
                        text: 'var(--text-primary)',
                        textSecondary: 'var(--text-secondary)'
                    }
                }
            },
            backgroundColor: {
                primary: 'var(--bg-primary)',
                secondary: 'var(--bg-secondary)'
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)'
            },
            borderColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['DM Sans', 'sans-serif']
            }
        }
    },
    variants: {
        extend: {
            backgroundColor: ['dark', 'dark:hover'],
            textColor: ['dark', 'dark:hover'],
            borderColor: ['dark', 'dark:hover']
        }
    },
    plugins: []
};
