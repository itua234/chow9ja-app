/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./App.{js,jsx,ts,tsx}", 
      "./components/**/*.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}"  
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        fontFamily: {
          'primary': ["Campton-Medium", "sans-serif"],
        },
        colors: {
          primary: {
            DEFAULT: '#121212'
            //DEFAULT: '#1D61E7', // This is used for both bg-primary and text-primary
            // You can also add variants if needed
            // light: '#lighter-shade',
            // dark: '#darker-shade'
          },
          disabled: {
            DEFAULT: '', // Add your disabled color
          }
        }
      },
    },
    plugins: [],
}