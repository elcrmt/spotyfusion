/**
 * Prettier configuration for SpotyFusion
 * @see https://prettier.io/docs/en/configuration.html
 */
const config = {
  // Use single quotes instead of double quotes
  singleQuote: true,

  // Add semicolons at the end of statements
  semi: true,

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',

  // Print width - wrap lines at 80 characters
  printWidth: 80,

  // Put the > of a multi-line JSX element at the end of the last line
  bracketSameLine: false,

  // Include parentheses around a sole arrow function parameter
  arrowParens: 'always',

  // Line endings - auto detect
  endOfLine: 'auto',

  // Plugins for Tailwind CSS class sorting
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
