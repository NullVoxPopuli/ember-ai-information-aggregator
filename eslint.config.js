import nodePlugin from "eslint-plugin-n";

export default [
  ...nodePlugin.configs["flat/mixed-esm-and-cjs"],
  {
    rules: {
      "n/exports-style": ["error", "module.exports"],
      // We aren't publishing
      'n/no-unpublished-import': 'off'
    },
  },
]