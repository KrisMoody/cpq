export default defineAppConfig({
  ui: {
    // Semantic color mappings to GetAccept palette
    // GetAccept uses navy (base-blue #2c3b4e) for primary buttons
    colors: {
      primary: 'ga-navy',      // Navy for primary actions (matches GA primary button)
      secondary: 'ga-blue',    // Blue for links/info
      success: 'ga-green',
      info: 'ga-blue',
      warning: 'ga-yellow',
      error: 'ga-red',
      neutral: 'ga-gray'
    },

    // Button component overrides
    // GetAccept fried-tofu button mapping:
    // - GA Primary (navy solid)     → solid (default)
    // - GA Secondary (navy outline) → outline
    // - GA Tertiary (light gray bg) → soft
    // - GA Ghost (transparent)      → ghost
    // - GA Danger (red outline)     → outline + color="error"
    button: {
      slots: {
        base: 'font-semibold rounded-md'
      },
      variants: {
        variant: {
          solid: 'shadow-sm',
          outline: 'shadow-sm',
          soft: 'shadow-none',
          subtle: 'shadow-none',
          ghost: 'shadow-none',
          link: 'shadow-none underline-offset-2'
        }
      },
      defaultVariants: {
        color: 'primary'
      }
    },

    // Card component overrides
    card: {
      slots: {
        root: 'bg-white shadow-sm rounded-md',
        header: 'p-4 border-b border-ga-gray-300',
        body: 'p-4',
        footer: 'p-4 border-t border-ga-gray-300'
      }
    },

    // Input component overrides
    input: {
      slots: {
        root: 'rounded-md',
        base: 'rounded-md border-ga-gray-400 focus:border-ga-blue-500 focus:ring-ga-blue-500'
      }
    },

    // Modal component overrides
    modal: {
      slots: {
        overlay: 'bg-ga-gray-950/50',
        content: 'bg-white shadow-lg rounded-md'
      }
    },

    // Alert component overrides
    alert: {
      slots: {
        root: 'rounded-md'
      }
    },

    // Badge component overrides
    badge: {
      slots: {
        base: 'rounded-sm font-medium'
      }
    },

    // Table component overrides
    table: {
      slots: {
        th: 'text-ga-gray-700 font-semibold',
        td: 'text-ga-gray-950'
      }
    }
  }
})
