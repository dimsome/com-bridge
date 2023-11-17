import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            borderRadius: {
              'card': '2rem'
            },
            colors: {
                'brand': '#F15025',
                'back': '#202020',
                'success': {
                    '100': '#27806E',
                    '10': '#D1F0EA'
                },
                'warning': {
                    '100': '#F4D35E',
                    '10': '#FDF5D8'
                },
                'critical': {
                    '100': '#D94A1E',
                    '10': '#F0D1D1'
                },
                'gray': {
                    '50': '#F1F1F1',
                    '200': '#D3D3D3',
                    '400': '#AFAFAF',
                    '500': '#838383',
                    '600': '#7C7C7C',
                    '700': '#4a4a4a',
                    '800': '#343434',
                    '900': '#202020',
                },
                'pink': {
                    '500':'#F49097',
                    '300':'#F6A6AC',
                    '100':'#F8BCC1',
                    '50':'#FBD3D5'
                },
                'drab': {
                    '500':'#65522F',
                    '300':'#847559',
                    '100':'#A39782',
                    '50':'#C1BAAC'
                },
                'purple': {
                    '500':'#1F1A38',
                    '300':'#4C4860',
                    '100':'#797688',
                    '50':'#A5A3AF'
                },
                'primary': {
                    '50': '#B9AEBD',
                    '100': '#95859B',
                    '300': '#725D7A',
                    '500': '#4F3459'
                },

            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
