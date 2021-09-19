module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			outline: {
				while_solid: '1px solid white',
				black_solid: '1px solid black',
			},
			colors: {
				amazon_blue: {
					light: '#232F3E',
					DEFAULT: '#131921',
				},
			},
			animation: {
				'time-out-3s': 'move 3s linear 0s',
				'time-out-2s': 'move 2s linear 0s',
				'time-out-1s': 'move 1s linear 0s',
				'text-1s': 'text 1s ease-in-out infinite',
				'dash-4s': 'dash 4s cubic-bezier(0.455, 0.3, 0.515, 0.955) infinite alternate-reverse',
				'scale-1s': 'scale 0.3s ease-in-out 0s',
				'slide-500': 'slide 0.5s ease-out forwards',
				'slideIn-500': 'slideIn 0.5s ease-out forwards',
				'slide-right-500': 'slide-right 0.5s ease-out forwards',
				'slideIn-right-500': 'slideIn-right 0.5s ease-out forwards',
				wiggle: 'wiggle 1s ease-in-out infinite',
			},
			keyframes: {
				slide: {
					from: { transform: 'translateX(0px)' },
					to: { transform: 'translateX(-400px)' },
				},
				'slide-right': {
					from: { transform: 'translateX(0px)' },
					to: { transform: 'translateX(400px)' },
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-13deg)' },
					'50%': { transform: 'rotate(13deg)', opacity: 0.5 },
				},
				slideIn: {
					from: { transform: 'translateX(-400px)' },
					to: { transform: 'translateX(0px)' },
				},
				'slideIn-right': {
					from: { transform: 'translateX(400px)' },
					to: { transform: 'translateX(0px)' },
				},
				move: {
					from: { width: '100%' },
					to: { width: '0px' },
				},
				dash: {
					to: {
						strokeDasharray: '1, 150',
					},
				},
				text: {
					'50%': {
						opacity: ' 0.1',
					},
				},
				scale: {
					from: {
						transform: 'scale(0)',
					},
					to: {
						transform: 'scale(1)',
					},
				},
			},
			gridTemplateRows: {
				'[auto,auto,1fr]': 'auto auto 1fr',
			},
			backgroundImage: {
				'flower-pattern': "url('/images/bg_flower.png')",
				'cart-pattern': "url('/images/bg1.png')",
				'khoi-pattern': "url('/images/bg2.png')",
				'blue-pattern': "url('/images/bg3.png')",
			},
			backgroundColor: {
				rgba: 'rgba(0,0,0,0.4)',
				'rgba-6': 'rgba(0,0,0,0.6)',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require('tailwind-scrollbar-hide'), require('@tailwindcss/line-clamp')],
};
