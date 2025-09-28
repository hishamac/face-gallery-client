# Face Gallery Client

A modern, responsive React TypeScript application for intelligent face recognition and photo gallery management. This client application provides an intuitive web interface for the Face Gallery API, offering comprehensive tools for photo organization, face detection, person management, and advanced clustering capabilities.

## 🌟 Overview

Face Gallery Client is a cutting-edge web application that leverages AI-powered face recognition to automatically organize your photo collection. Upload photos and watch as the system intelligently detects faces, groups similar faces into persons, and provides powerful tools for manual corrections and organization.

### Key Highlights

- **🎯 Intelligent Face Recognition**: Automatic face detection and clustering using advanced AI algorithms
- **📱 Modern React Architecture**: Built with React 19, TypeScript, and modern development practices
- **🎨 Beautiful UI/UX**: Clean, responsive design using Tailwind CSS and shadcn/ui components
- **⚡ Performance Optimized**: Fast loading times with code splitting and optimized builds
- **🔧 Developer Friendly**: Full TypeScript support with comprehensive error handling
- **🌐 Cross-Platform**: Works seamlessly across desktop and mobile devices

## ✨ Features

### 🖼️ Photo Management
- **Drag & Drop Upload**: Intuitive file uploading with progress tracking
- **Batch Processing**: Upload multiple images simultaneously
- **Album Organization**: Create and manage photo albums for events, dates, or themes
- **Section Categorization**: Further organize photos within albums using sections
- **Smart Filtering**: Filter photos by albums, sections, persons, and search terms
- **Image Preview**: High-quality image viewing with face detection overlays

### 👤 Person Management
- **Automatic Face Detection**: AI-powered face recognition identifies people in photos
- **Person Profiles**: Detailed view of each person with all their detected photos
- **Manual Corrections**: Move faces between persons when AI makes mistakes
- **Person Naming**: Assign custom names to detected persons
- **Face Search**: Find similar faces by uploading a reference photo
- **Smart Clustering**: Re-run face clustering while preserving manual assignments

### 🎛️ Admin Dashboard
- **System Statistics**: Comprehensive overview of your photo collection
- **Batch Operations**: Powerful tools for managing large photo collections
- **Database Management**: Reset, backup, and maintain your data
- **Upload Progress**: Real-time monitoring of photo processing
- **Error Handling**: Detailed error reporting and recovery options

### 🔧 Technical Features
- **Real-time Updates**: Live progress tracking for all operations
- **Offline Capabilities**: Robust handling of network interruptions
- **Mobile Responsive**: Optimized for tablets and smartphones
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark Mode Ready**: Prepared for theme switching (easily extensible)

## 🛠️ Technology Stack

### Core Technologies
- **[React 19](https://react.dev/)** - Latest React with concurrent features and improved hooks
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Strong typing for better development experience
- **[Vite 7.1](https://vitejs.dev/)** - Lightning-fast build tool with HMR
- **[React Router 7.9](https://reactrouter.com/)** - Modern client-side routing

### UI & Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality component library built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Beautiful and consistent icon library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible, unstyled component primitives

### Development Tools
- **[ESLint 9.36](https://eslint.org/)** - Code linting with TypeScript support
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixing
- **[PostCSS](https://postcss.org/)** - CSS processing and optimization

### HTTP & State Management
- **[Axios 1.12](https://axios-http.com/)** - Promise-based HTTP client with interceptors
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications

## 📁 Project Structure

```
client/
├── public/                    # Static assets
│   ├── favicon.png           # Application favicon
│   └── vite.svg             # Vite logo
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── select.tsx
│   │   │   └── textarea.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Layout.tsx         # Main user layout
│   │   │   ├── AdminLayout.tsx    # Admin dashboard layout
│   │   │   ├── Navbar.tsx         # Navigation bar
│   │   │   ├── AdminNavbar.tsx    # Admin navigation
│   │   │   └── Footer.tsx         # Site footer
│   │   ├── Admin.tsx        # Admin dashboard component
│   │   ├── Albums.tsx       # Album management interface
│   │   ├── Gallery.tsx      # Main photo gallery view
│   │   ├── ImageDetail.tsx  # Individual image detail page
│   │   ├── PersonDetail.tsx # Person profile page
│   │   ├── Persons.tsx      # Person listing page
│   │   └── Sections.tsx     # Section management interface
│   ├── hooks/               # Custom React hooks
│   │   └── usePageTitle.ts  # Dynamic page title management
│   ├── lib/                 # Utility libraries
│   │   └── utils.ts         # Helper functions and utilities
│   ├── services/            # API and external services
│   │   └── api.ts           # API service layer with all endpoints
│   ├── types/               # TypeScript type definitions
│   │   └── api.ts           # API response and request types
│   ├── App.tsx              # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── components.json          # shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.ts       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
├── vercel.json             # Vercel deployment configuration
└── vite.config.ts          # Vite build configuration
```

## � Getting Started

### Prerequisites

Before setting up the Face Gallery Client, ensure you have:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm or yarn** - Package manager (npm comes with Node.js)
- **Face Gallery API** - The backend API must be running (see `../api/README.md`)

### Quick Start

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   Create a `.env.local` file for custom configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=Face Gallery
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

### Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code for quality and consistency
npm run lint
```

## 🎯 Usage Guide

### Initial Setup

1. **Start the API Server**
   Ensure the Face Gallery API is running on `http://localhost:5000`

2. **Access the Application**
   Open `http://localhost:5173` in your web browser

3. **Admin Setup** (Recommended)
   - Visit `/admin` to access administrative features
   - Create albums and sections for better organization
   - Upload your first batch of photos

### Basic Workflow

#### 📸 Uploading Photos
1. **Navigate to Admin Dashboard** (`/admin`)
2. **Click "Upload Images"**
3. **Select multiple photos** using the file picker or drag & drop
4. **Optional**: Assign to an album or section during upload
5. **Monitor progress** as photos are processed
6. **Review results** as faces are automatically detected

#### 👥 Managing Persons
1. **Go to Persons page** (`/persons`)
2. **View automatically detected persons** from uploaded photos
3. **Click on a person card** to view their detail page
4. **Rename persons** by clicking the edit icon
5. **Move faces between persons** if the AI made mistakes
6. **Create new persons** by moving faces to "New Person"

#### 🔍 Searching and Organizing
1. **Use the search bar** to find specific photos or persons
2. **Filter by albums and sections** using dropdown menus
3. **Browse the gallery** to see all photos with face detection
4. **Use "Search by Image"** to find similar faces
5. **Organize photos** into albums and sections

#### ⚙️ Advanced Features
1. **Re-run Clustering**: Click "Cluster Faces" to re-analyze all faces
2. **View Statistics**: Check the dashboard for collection insights
3. **Manual Corrections**: Use face movement to fix AI mistakes
4. **Batch Operations**: Use admin tools for large-scale management

### Key Features Explained

#### 🤖 Intelligent Face Clustering
- Photos are automatically analyzed for faces upon upload
- Similar faces are grouped into persons using AI algorithms
- Manual corrections are preserved during re-clustering
- Confidence scores help identify uncertain matches

#### 🎨 Responsive Design
- Works seamlessly on desktop, tablet, and mobile devices
- Touch-friendly interface for mobile users
- Adaptive layouts that scale with screen size
- Optimized performance across all device types

#### 🔐 Privacy & Security
- All data remains on your local server
- No cloud processing or external API calls
- Photos and face data stored securely in your database
- Full control over your personal photo collection

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Application Settings
VITE_APP_NAME=Face Gallery
VITE_APP_DESCRIPTION=AI-Powered Photo Organization

# Upload Limits
VITE_MAX_FILE_SIZE=16777216  # 16MB in bytes
VITE_MAX_FILES_PER_BATCH=50

# UI Configuration
VITE_THEME_COLOR=#2563eb
VITE_ENABLE_DEBUG_MODE=false
```

### API Service Configuration

The API service can be configured in `src/services/api.ts`:

```typescript
// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const UPLOAD_TIMEOUT = 300000; // 5 minutes for uploads

// Request interceptors for authentication (if needed)
api.interceptors.request.use(
  (config) => {
    // Add authorization headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Tailwind CSS Customization

Customize the design system in `tailwind.config.ts`:

```typescript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add your custom color palette
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

## 🚀 Deployment

### Production Build

Create an optimized production build:

```bash
# Generate production build
npm run build

# The built files will be in the 'dist/' directory
ls dist/
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify (drag & drop dist/ folder or use CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Static Hosting Services
The built `dist/` directory can be deployed to any static hosting service:
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**

#### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Server Configuration

For single-page applications, configure your server to serve `index.html` for all routes:

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html
    
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

### Environment-Specific Builds

Configure different environments:

```json
{
  "scripts": {
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production"
  }
}
```

Create corresponding `.env.staging` and `.env.production` files.

## 🔧 Development

### Development Environment Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Enable TypeScript Strict Mode**
   The project uses strict TypeScript settings for better code quality.

### Code Quality Tools

#### ESLint Configuration
The project includes comprehensive linting rules:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors where possible
npm run lint -- --fix
```

#### TypeScript Type Checking
```bash
# Type check without building
npx tsc --noEmit

# Type check in watch mode
npx tsc --noEmit --watch
```

### Hot Module Replacement (HMR)

Vite provides instant HMR for React components:
- Changes to components update instantly
- State is preserved where possible
- CSS changes are reflected immediately

### Browser Developer Tools

Recommended browser extensions for development:
- **React Developer Tools** - Component inspection and profiling
- **Redux DevTools** - State management debugging (if using Redux)
- **Lighthouse** - Performance and accessibility auditing

### Performance Optimization

#### Code Splitting
The application uses automatic code splitting:
```typescript
// Lazy load components
const AdminComponent = lazy(() => import('./components/Admin'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <AdminComponent />
</Suspense>
```

#### Bundle Analysis
Analyze your bundle size:
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts and build
npm run build
```

## 🎨 Customization

### Theme Customization

The application uses a design system built with Tailwind CSS and shadcn/ui:

#### Color Scheme
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      }
    }
  }
}
```

#### Component Customization
shadcn/ui components can be customized:
```bash
# Add new components
npx shadcn-ui@latest add component-name

# Customize existing components in src/components/ui/
```

### Layout Customization

#### Custom Layouts
Create custom layouts by extending the base layout structure:
```typescript
// src/components/layout/CustomLayout.tsx
export const CustomLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <CustomNavbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <CustomFooter />
    </div>
  );
};
```

#### Navigation Customization
Modify navigation in `src/components/layout/Navbar.tsx`:
- Add new menu items
- Change navigation behavior
- Customize mobile menu

## 🐛 Troubleshooting

### Common Issues

#### API Connection Issues
```
Error: Network Error or CORS issues
```
**Solution:**
1. Ensure the API server is running on the correct port
2. Check CORS settings in the API configuration
3. Verify the `VITE_API_BASE_URL` environment variable

#### Build Issues
```
Error: TypeScript compilation errors
```
**Solution:**
1. Run `npx tsc --noEmit` to check for type errors
2. Fix any TypeScript errors in your code
3. Ensure all dependencies are properly installed

#### Upload Issues
```
Error: File upload fails or times out
```
**Solution:**
1. Check file size limits (default 16MB)
2. Verify API server upload configuration
3. Ensure stable network connection

#### Performance Issues
```
Slow loading or high memory usage
```
**Solution:**
1. Enable production mode for testing
2. Check network tab for large API responses
3. Use React Developer Tools to profile components

### Debugging

#### Development Debugging
```typescript
// Enable debug logging
if (import.meta.env.DEV) {
  console.log('Debug information:', data);
}

// Use React Developer Tools
import { StrictMode } from 'react';
```

#### Production Debugging
```typescript
// Add error boundaries
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

### Performance Monitoring

#### Lighthouse Audits
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Audit your application
lighthouse http://localhost:5173 --output html
```

#### Bundle Size Monitoring
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer
```

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

### Development Guidelines
- Use functional components with hooks
- Implement proper error handling
- Follow accessibility guidelines
- Optimize for performance
- Maintain responsive design

## � API Integration

### Available Endpoints

The client integrates with the following API endpoints:

#### Image Management
- `GET /images/` - Fetch all images with filtering
- `POST /images/upload` - Upload single image
- `POST /images/upload-multiple` - Upload multiple images
- `GET /images/:id` - Get specific image details
- `POST /images/search-by-image` - Search for similar faces

#### Person Management
- `GET /persons/` - Fetch all persons
- `GET /persons/:id` - Get person details
- `PUT /persons/:id/rename` - Rename person

#### Face Operations
- `PUT /faces/:id/move` - Move face to existing person
- `PUT /faces/:id/move-to-new` - Create new person from face

#### Organization
- `GET /albums/` - Fetch all albums
- `POST /albums/` - Create new album
- `PUT /albums/:id` - Update album
- `DELETE /albums/:id` - Delete album
- `GET /sections/` - Fetch all sections
- `POST /sections/` - Create new section

#### System Operations
- `GET /cluster/` - Trigger face clustering
- `GET /stats/` - Get system statistics
- `DELETE /reset` - Reset database

### Type Safety

All API responses are typed using TypeScript interfaces:

```typescript
// src/types/api.ts
export interface Person {
  _id: string;
  name: string;
  faces: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Image {
  _id: string;
  filename: string;
  faces: Face[];
  persons: string[];
  album_id?: string;
  section_id?: string;
  created_at: string;
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vercel Team** - For Vite and excellent tooling
- **shadcn** - For the beautiful UI component library
- **Tailwind Labs** - For the utility-first CSS framework
- **Open Source Community** - For all the amazing packages and tools

---

## 📞 Support

For support, please:
1. Check the troubleshooting section above
2. Review the API documentation
3. Create an issue in the repository
4. Contact the development team

**Happy organizing! 📸✨**
