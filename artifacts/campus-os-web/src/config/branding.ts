/**
 * CampusOS Brand & UI Customization Configuration
 * 
 * Edit this file to easily customize the application identity,
 * institution name, taglines, support channels, and visual branding.
 */

export interface BrandConfig {
  /** The name of your application */
  appName: string;
  /** Primary mark abbreviation (e.g., 'C' for CampusOS) */
  markText: string;
  /** Sub-tagline displayed under the brand title */
  tagline: string;
  /** Category or workspace kicker label */
  workspaceKicker: string;
  /** The institution or campus organization */
  institution: string;
  /** Live status banner text */
  statusText: string;
  /** Status banner subtext */
  statusSubtext: string;
  /** Optional contact / support email */
  supportEmail: string;
  /** Accent colors used in customized elements */
  theme: {
    primaryColor: string;
    accentColor: string;
    markBackground: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  appName: 'CampusOS',
  markText: 'C',
  tagline: 'operations, clarified',
  workspaceKicker: 'Student workspace',
  institution: 'Metropolitan University',
  statusText: 'Campus systems live',
  statusSubtext: 'Reference data refreshed this morning.',
  supportEmail: 'ops@campus-os.internal',
  theme: {
    primaryColor: '#0284c7', // Sky-600
    accentColor: '#38bdf8',  // Sky-400
    markBackground: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%)',
  },
};
