/** @type {import('tailwindcss').Config} */
export default {
   theme: {
      extend: {
         fontFamily: {
            custom: ['TitleFont', 'sans-serif'],
         },
      },
   },
   content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
   plugins: [],
}