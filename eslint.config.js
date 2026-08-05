// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const jsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: { 'jsx-a11y': jsxA11y },
    // Mapea componentes RN a sus equivalentes HTML para que jsx-a11y los analice
    settings: {
      'jsx-a11y': {
        components: {
          TouchableOpacity: 'button',
          TextInput: 'input',
          Text: 'p',
          Image: 'img',
          ScrollView: 'div',
          View: 'div',
        },
      },
    },
    rules: {
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/label-has-associated-control': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);

