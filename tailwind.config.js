/** @type {import('tailwindcss').Config} */
export default {
   theme: {
      extend: {
         fontFamily: {
            title: ['Title', 'sans-serif']
         },
      },
   },
   content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
   plugins: [],
}