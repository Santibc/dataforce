import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
// hooks
import useLocalStorage from '../../hooks/useLocalStorage';
//
import { worker } from 'src/mocks/browser';
import { defaultSettings } from './config';
import { defaultPreset, getPresets, presetsOption } from './presets';
import {
  SettingsContextProps,
  ThemeColorPresetsValue,
  ThemeContrastValue,
  ThemeDirectionValue,
  ThemeLayoutValue,
  ThemeModeValue,
} from './types';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},
  // Direction
  onToggleDirection: () => {},
  onChangeDirection: () => {},
  onChangeDirectionByLang: () => {},
  // Layout
  onChangeLayout: () => {},
  // Contrast
  onToggleContrast: () => {},
  onChangeContrast: () => {},
  // Color
  onChangeColorPresets: () => {},
  presetsColor: defaultPreset,
  presetsOption: [],
  // Stretch
  onToggleStretch: () => {},
  // Reset
  onResetSetting: () => {},
  // Mock Server
  onToggleMockServer: (checked: boolean) => {},
};

// ----------------------------------------------------------------------

export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  const langStorage = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : '';

  const isArabic = langStorage === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Mode
  const onToggleMode = useCallback(() => {
    const themeMode = settings.themeMode === 'light' ? 'dark' : 'light';
    setSettings({ ...settings, themeMode });
  }, [setSettings, settings]);

  const onChangeMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const themeMode = event.target.value as ThemeModeValue;
      setSettings({ ...settings, themeMode });
    },
    [setSettings, settings]
  );

  // Direction
  const onToggleDirection = useCallback(() => {
    const themeDirection = settings.themeDirection === 'rtl' ? 'ltr' : 'rtl';
    setSettings({ ...settings, themeDirection });
  }, [setSettings, settings]);

  const onChangeDirection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const themeDirection = event.target.value as ThemeDirectionValue;
      setSettings({ ...settings, themeDirection });
    },
    [setSettings, settings]
  );

  const onChangeDirectionByLang = useCallback(
    (lang: string) => {
      const themeDirection = lang === 'ar' ? 'rtl' : 'ltr';
      setSettings({ ...settings, themeDirection });
    },
    [setSettings, settings]
  );

  // Layout
  const onChangeLayout = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const themeLayout = event.target.value as ThemeLayoutValue;
      setSettings({ ...settings, themeLayout });
    },
    [setSettings, settings]
  );

  // Contrast
  const onToggleContrast = useCallback(() => {
    const themeContrast = settings.themeContrast === 'default' ? 'bold' : 'default';
    setSettings({ ...settings, themeContrast });
  }, [setSettings, settings]);

  const onChangeContrast = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const themeContrast = event.target.value as ThemeContrastValue;
      setSettings({ ...settings, themeContrast });
    },
    [setSettings, settings]
  );

  // Color
  const onChangeColorPresets = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const themeColorPresets = event.target.value as ThemeColorPresetsValue;
      setSettings({ ...settings, themeColorPresets });
    },
    [setSettings, settings]
  );

  // Stretch
  const onToggleStretch = useCallback(() => {
    const themeStretch = !settings.themeStretch;
    setSettings({ ...settings, themeStretch });
  }, [setSettings, settings]);

  // Reset
  const onResetSetting = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  // Mock Server
  const onToggleMockServer = useCallback(
    (mocking: boolean) => {
      const mockServer = !settings.mockServer;
      setSettings({ ...settings, mockServer });
    },
    [setSettings, settings]
  );

  useLayoutEffect(() => {
    if (settings.mockServer) {
      worker.start({
        onUnhandledRequest: 'bypass',
      });
    } else {
      worker.stop();
    }
  }, [settings.mockServer]);

  const value = useMemo(
    () => ({
      ...settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onChangeLayout,
      // Contrast
      onChangeContrast,
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      presetsOption,
      presetsColor: getPresets(settings.themeColorPresets),
      // Reset
      onResetSetting,
      // Mock Server
      onToggleMockServer,
    }),
    [
      settings,
      // Mode
      onToggleMode,
      onChangeMode,
      // Direction
      onToggleDirection,
      onChangeDirection,
      onChangeDirectionByLang,
      // Layout
      onChangeLayout,
      onChangeContrast,
      // Contrast
      onToggleContrast,
      // Stretch
      onToggleStretch,
      // Color
      onChangeColorPresets,
      // Reset
      onResetSetting,
      // Mock Server
      onToggleMockServer,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
