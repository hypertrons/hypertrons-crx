type ThemeType = 'light' | 'dark';

type FeatureName = string;
type FeatureId = `hypercrx-${FeatureName}`;

// It should be just for README.md, but 🤷‍♂️
declare module '*.md' {
  export const importedFeatures: FeatureName[];
}
