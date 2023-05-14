type ThemeType = 'light' | 'dark';

type FeatureID = string;

// It should be just for README.md, but 🤷‍♂️
declare module '*.md' {
  export const importedFeatures: FeatureID[];
}
