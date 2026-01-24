# ItoMcovertor Web

A static HTML/CSS/JS unit converter website with 120+ conversion types.

## Features

- **120+ Conversions** across 12 categories with full SI scale support
- **Real-time Conversion** as you type
- **Swap Units** button for quick direction toggle
- **Conversion History** saved to localStorage
- **Mobile-Responsive** dark theme design
- **SEO Optimized** with meta tags and structured content
- **No Server Required** - pure static files

## Categories

| Category | Conversions |
|----------|-------------|
| Length | in, ft, yd, mi to/from mm, cm, m, km + SI scale |
| Area | sq in, sq ft, acre, sq mi to/from cm2, m2, ha, km2 |
| Volume (Liquid) | tsp, tbsp, cup, pint, quart, gallon to/from ml, L + SI scale |
| Volume (Solid) | cu in, cu ft, cu yd to/from cm3, m3 |
| Mass | oz, lb, stone, ton to/from g, kg, tonne + SI scale |
| Temperature | F to/from C to/from K |
| Speed | mph, ft/s to/from km/h, m/s + SI scale |
| Pressure | psi, inHg to/from Pa, kPa, bar + SI scale |
| Energy | BTU, ft-lb to/from J, kJ + SI scale |
| Power | hp to/from W, kW + SI scale |
| Force | lbf to/from N |
| Nautical | nm to/from km |

## Local Development

Simply open `index.html` in a web browser. No build step required.

## Deploy to Hostinger

### Option 1: File Manager (Easiest)

1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Files** > **File Manager**
3. Navigate to `public_html`
4. Delete any existing files (or keep if you want a subdirectory)
5. Click **Upload** and select all files from this `web/` folder:
   - `index.html`
   - `css/styles.css`
   - `js/converter.js`
   - `js/app.js`
6. Maintain the folder structure (css/ and js/ folders)
7. Visit your domain

### Option 2: FTP Upload

1. Get FTP credentials from Hostinger hPanel > **Files** > **FTP Accounts**
2. Connect using FileZilla or similar FTP client
3. Upload all files to `public_html`
4. Maintain folder structure

### Option 3: Git Deployment (Advanced)

1. In Hostinger hPanel, go to **Advanced** > **Git**
2. Connect your GitHub repository
3. Set deployment directory to `web/`
4. Auto-deploy on push

## Folder Structure

```
web/
├── index.html          # Main page
├── changelog.html      # Version history
├── privacy.html        # Privacy policy
├── support.html        # Help and support
├── css/
│   └── styles.css      # Styling
├── js/
│   ├── converter.js    # Conversion logic
│   └── app.js          # UI interactions
├── components/         # Reusable HTML components
├── logo.png            # Site logo
├── logo.svg            # Vector logo
├── og-image.png        # Social sharing image
└── README.md           # This file
```
