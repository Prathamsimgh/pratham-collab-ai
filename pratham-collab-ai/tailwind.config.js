const colors = require("tailwindcss/colors");

module.exports = {
    darkMode: "class",
    content: ["./src/app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Default: LPU Orange (primary shade tuned at 600)
                brand: {
                    50: "#FFF7ED",
                    100: "#FFEDD5",
                    200: "#FED7AA",
                    300: "#FDBA74",
                    400: "#FB923C",
                    500: "#F97316",
                    600: "#F26D21", // Pratham/LPU primary
                    700: "#C2410C",
                    800: "#9A3412",
                    900: "#7C2D12",
                    950: "#431407",
                },
                // Additional semantic palettes
                accent: colors.indigo,
                success: colors.emerald,
                warning: colors.amber,
                danger: colors.rose,
                info: colors.sky,
            },
        },
    },
    plugins: [],
};
