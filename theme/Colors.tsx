import type { Theme } from './ThemeContext';
import { typography } from './typography';


export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    // 🌿 Core React Navigation Theme Colors
    primary: '#00796B',
    background: '#FAFAFA',
    card: '#FFFFFF',
    text: '#212121',
    border: '#E0E0E0',
    notification: '#C62828',

    // 🌿 Extended Sahara 14567 Tokens
    // Primary
    colorPrimary50: '#E0F2F1',
    colorPrimary100: '#B2DFDB',
    colorPrimary200: '#80CBC4',
    colorPrimary300: '#4DB6AC',
    colorPrimary400: '#26A69A',
    colorPrimary500: '#00796B',
    colorPrimary600: '#00695C',
    colorPrimary700: '#004D40',
    colorPrimary800: '#00332D',

    // Accent / SOS
    colorAccent50: '#FFEBEE',
    colorAccent100: '#FFCDD2',
    colorAccent300: '#E57373',
    colorAccent500: '#C62828',
    colorAccent700: '#8E0000',
    colorAccent900: '#5D0000',

    // Validation & Functional
    colorSuccess100: '#E8F5E9',
    colorSuccess400: '#66BB6A',
    colorSuccess600: '#388E3C',
    colorWarning100: '#FFF8E1',
    colorWarning400: '#FFB300',
    colorWarning600: '#F57C00',
    colorError100: '#FFEBEE',
    colorError400: '#E53935',
    colorError600: '#C62828',

    // Neutral / Backgrounds
    colorBgPage: '#FAFAFA',
    colorBgSurface: '#FFFFFF',
    colorBgAlt: '#F5F5F5',
    colorBorder: '#E0E0E0',
    colorShadow: 'rgba(0,0,0,0.15)',
    colorOverlay: 'rgba(0,0,0,0.35)',

    // Text
    colorTextPrimary: '#212121',
    colorTextSecondary: '#424242',
    colorTextTertiary: '#616161',
    colorTextInverse: '#FFFFFF',
    colorLink: '#00796B',
    colorHeadingH1: '#0D47A1',
    colorHeadingH2: '#1E88E5',

    // Buttons
    btnPrimaryBg: '#00796B',
    btnPrimaryHover: '#00695C',
    btnPrimaryText: '#FFFFFF',
    btnSecondaryBg: '#E0F2F1',
    btnSecondaryBorder: '#00796B',
    btnDisabledBg: '#E0E0E0',
    btnDisabledText: '#9E9E9E',
    btnSosBg: '#C62828',
    btnSosText: '#FFFFFF',

    // Inputs
    inputBg: '#FFFFFF',
    inputBorder: '#BDBDBD',
    inputFocusBorder: '#00796B',
    inputPlaceholder: '#9E9E9E',
    inputText: '#212121',
    inputErrorBorder: '#E53935',

    // Navigation / System UI
    navBg: '#FFFFFF',
    navActive: '#00796B',
    navInactive: '#9E9E9E',
    navDivider: '#E0E0E0',
    toastBgSuccess: '#388E3C',
    toastBgError: '#C62828',
    toastText: '#FFFFFF',

    // Validation Feedback
    validationSuccessBg: '#E8F5E9',
    validationSuccessText: '#2E7D32',
    validationWarningBg: '#FFF3E0',
    validationWarningText: '#F57C00',
    validationErrorBg: '#FFEBEE',
    validationErrorText: '#C62828',
    validationInfoBg: '#E3F2FD',
    validationInfoText: '#1976D2',
  },

  // ✅ Add missing `heavy` weight (required by React Navigation)
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
  },

  // ✅ Typography will be merged at runtime inside RootLayout
  typography,
};
