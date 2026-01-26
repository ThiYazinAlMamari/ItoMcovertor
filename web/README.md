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

| Category          | Units                                                         |
|-------------------|---------------------------------------------------------------|
| Length            | in, ft, yd, mi, mm, cm, m, km + full SI scale (ym to Ym)      |
| Area              | sq in, sq ft, acre, sq mi, cm2, m2, ha, km2                   |
| Volume (Liquid)   | tsp, tbsp, cup, pint, quart, gallon, ml, L + full SI scale    |
| Volume (Solid)    | cu in, cu ft, cu yd, cm3, m3                                  |
| Mass              | oz, lb, stone, ton, g, kg, tonne + full SI scale (ug to Yg)   |
| Temperature       | F, C, K                                                       |
| Speed             | mph, ft/s, km/h, m/s + full SI scale (mm/s to km/s)           |
| Pressure          | psi, inHg, Pa, kPa, bar + full SI scale (Pa to YPa)           |
| Energy            | BTU, ft-lb, J, kJ + full SI scale (J to QJ)                   |
| Power             | hp, W, kW + full SI scale (W to YW)                           |
| Force             | lbf, N                                                        |
| Nautical          | nm, km                                                        |

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

```text
web/
├── index.html          # Main page
├── about.html          # About page
├── faq.html            # FAQ page
├── changelog.html      # Version history
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── support.html        # Help and support
├── 404.html            # Error page
├── css/
│   └── styles.css      # Styling
├── js/
│   ├── converter.js    # Conversion logic
│   ├── components.js   # Reusable UI components
│   └── app.js          # UI interactions
├── components/
│   ├── header.html     # Site header
│   └── footer.html     # Site footer
├── logo.png            # Site logo
├── logo.svg            # Vector logo
├── og-image.png        # Social sharing image
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler rules
└── README.md           # This file
```
