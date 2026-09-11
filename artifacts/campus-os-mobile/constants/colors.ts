/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#1b2937',
    tint: '#2f8378',

    // Core surfaces
    background: '#f2efe5',
    foreground: '#1b2937',

    // Cards / elevated surfaces
    card: '#fcfbf8',
    cardForeground: '#1b2937',

    // Primary action color (buttons, links, active states)
    primary: '#2f8378',
    primaryForeground: '#fcfbf8',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#e8d4b0',
    secondaryForeground: '#1b2937',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#e7e2d5',
    mutedForeground: '#5b6570',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#e58a6f',
    accentForeground: '#1b2937',

    // Destructive actions (delete, error states)
    destructive: '#ca493e',
    destructiveForeground: '#fcfbf8',

    // Borders and input outlines
    border: '#ded7c8',
    input: '#d7cfbf',
  },

  dark: {
    text: '#f5f2e9',
    tint: '#76c9bb',
    background: '#1e2934',
    foreground: '#f5f2e9',
    card: '#24323f',
    cardForeground: '#f5f2e9',
    primary: '#76c9bb',
    primaryForeground: '#14212d',
    secondary: '#344352',
    secondaryForeground: '#f5f2e9',
    muted: '#344352',
    mutedForeground: '#c2c0b8',
    accent: '#ee9d84',
    accentForeground: '#14212d',
    destructive: '#e47c70',
    destructiveForeground: '#f5f2e9',
    border: '#40505d',
    input: '#4d5e6b',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
