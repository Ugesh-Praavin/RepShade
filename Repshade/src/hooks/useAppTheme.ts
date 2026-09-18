import { useColorScheme } from 'react-native';
import { theme } from '../constants/theme';

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light'; // Default to dark for performance aesthetic
  const currentTheme = isDark ? theme.dark : theme.light;

  return {
    isDark,
    theme: currentTheme,
    spacing: theme.spacing,
    radius: theme.radius,
    typography: theme.typography,
  };
}
