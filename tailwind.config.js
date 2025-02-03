/** @type {import('tailwindcss').Config} */
export default {
   theme: {
      extend: {
         width: { app: '400px' },
         minWidth: { app: '400px' },
         screens: {
            xxs: '300px'
         },
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