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
                        bg: '#0f172a',
                        card: '#1e293b',
                        text: '#f8fafc'
                    },
                    light: {
                        bg: '#ffffff',
                        card: '#f1f5f9',
                        text: '#0f172a'
                    }
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['DM Sans', 'sans-serif']
            }
        }
    },
    plugins: []
};
