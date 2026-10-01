/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05080f",
        card: "rgba(10, 16, 31, 0.75)",
        cardBorder: "rgba(0, 229, 255, 0.15)",
        cyan: {
          electric: "#00e5ff",
          glow: "rgba(0, 229, 255, 0.35)"
        },
        neon: {
          green: "#39ff88",
          glow: "rgba(57, 255, 136, 0.35)"
        },
        amber: {
          electric: "#ffb703",
          glow: "rgba(255, 183, 3, 0.35)"
        },
        rose: {
          danger: "#ff3366",
          glow: "rgba(255, 51, 102, 0.4)"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"]
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'drive-bob': 'driveBob 0.8s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        driveBob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-1.5px)' }
        }
      }
    },
  },
  plugins: [],
}
