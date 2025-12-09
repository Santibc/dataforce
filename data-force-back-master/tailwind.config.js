const colors = require('tailwindcss/colors')

module.exports = {
    content: [
        './resources/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
                secondary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e'
                },
                black: colors.black,
                white: colors.white,
                gray: colors.coolGray,
                indigo: colors.indigo,
                blueGray: colors.blueGray,
                red: colors.rose,
                orange: colors.amber,
                green: colors.teal,
                teal: colors.teal,
                purple: colors.purple,
                blue: colors.blue,
                danger: colors.rose,
                success: colors.teal,
                warning: colors.amber
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
