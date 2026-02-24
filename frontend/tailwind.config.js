/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    mesh: '#0f172a',
                    card: 'rgba(30, 41, 59, 0.7)',
                    'card-hover': 'rgba(51, 65, 85, 0.8)',
                },
                primary: {
                    DEFAULT: '#8b5cf6', // Violet 500
                    hover: '#7c3aed', // Violet 600
                },
                accent: {
                    DEFAULT: '#06b6d4', // Cyan 500
                },
                text: {
                    main: '#f8fafc', // Slate 50
                    muted: '#94a3b8', // Slate 400
                },
                border: 'rgba(148, 163, 184, 0.1)',
                success: '#10b981',
                error: '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                glow: '0 0 15px rgba(139, 92, 246, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
