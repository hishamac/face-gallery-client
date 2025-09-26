# Fansat - Face Recognition Client

A modern React TypeScript application for intelligent face clustering and gallery management. This client provides an intuitive interface for the Fansat face recognition system with comprehensive album and section organization, dynamic page titles, and real-time progress tracking.

## 🚀 Features

### Core Functionality
- **Batch Image Upload**: Upload multiple images simultaneously with drag-and-drop support and real-time progress
- **Smart Face Detection**: Automatic face detection and extraction from uploaded images using base64 storage
- **Intelligent Face Clustering**: Advanced face recognition algorithms to group similar faces automatically
- **Upload Progress Tracking**: Real-time upload progress indicators with percentage and file-by-file status
- **Face Search by Image**: Upload an image to find similar faces across your entire gallery with confidence scores
- **File Validation**: Client-side file size and type validation with user-friendly error messages

### Advanced Person Management
- **Person Detail Pages**: Comprehensive view of all faces and images for each person with dynamic page titles
- **Manual Face Assignment**: Move faces between persons or create new persons when clustering is incorrect
- **Person Renaming**: Rename persons with custom names (preserved during reclustering) with real-time updates
- **Protected Manual Assignments**: Manual face assignments are protected from automatic reclustering
- **Auto-cleanup**: Empty persons are automatically deleted when their last face is moved
- **Person Thumbnails**: First detected face serves as person thumbnail with fallback handling

### Gallery Organization
- **Album Management**: Create, edit, and delete albums for organizing images
- **Section Management**: Organize images by sections within or across albums
- **Hierarchical Organization**: Support album-section-image hierarchy for complex organization
- **Filtering & Search**: Filter images by albums, sections, persons, and search terms
- **Image Gallery Views**: Browse all images with face detection information and metadata

### User Interface
- **Dynamic Page Titles**: Context-aware page titles (e.g., "Fansat | Gallery", "Fansat | Person Name")
- **Dual Layout System**: Separate user and admin layouts for different workflows with navigation
- **Image Detail Pages**: View all detected faces in each image with person assignments and metadata
- **Interactive Face Management**: Click-to-move faces with intuitive modal dialogs and confirmations
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components for all screen sizes
- **Real-time Statistics**: Live counts of images, faces, persons, albums, and sections with auto-refresh
- **Toast Notifications**: User feedback for all operations with success/error states and timeouts
- **Loading States**: Comprehensive loading indicators and skeleton screens for better UX

### Admin Features
- **Admin Dashboard**: Comprehensive administrative interface for system management with statistics
- **Batch Operations**: Upload multiple images with album/section assignment and progress tracking
- **Database Statistics**: Real-time stats on gallery contents and processing metrics with refresh
- **System Reset**: Complete database cleanup functionality (with confirmation dialogs)
- **Clustering Controls**: Trigger re-clustering while preserving manual assignments
- **Upload Management**: Advanced upload controls with file size validation and error handling

## 🛠 Tech Stack

- **React 19** - Latest React with enhanced hooks and concurrent features
- **TypeScript** - Type-safe development with strict type checking
- **Vite** - Fast development and build tool with Hot Module Replacement
- **React Router** - Client-side routing for SPA navigation with nested routes
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - Beautiful and accessible UI components built on Radix UI
- **Axios** - HTTP client for API communication with request/response interceptors and timeout handling
- **Sonner** - Modern toast notifications for user feedback
- **Lucide React** - Beautiful and consistent icon library

## 📁 Project Structure

```
client/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── layout/          # Layout components (user & admin)
│   │   ├── Gallery.tsx      # Main gallery view with filtering
│   │   ├── Admin.tsx        # Admin dashboard and controls
│   │   ├── Persons.tsx      # Person listing and management
│   │   ├── PersonDetail.tsx # Person detail page with face management
│   │   ├── ImageDetail.tsx  # Image detail page with face assignments
│   │   ├── Albums.tsx       # Album management interface
│   │   └── Sections.tsx     # Section management interface
│   ├── services/
│   │   └── api.ts           # API service layer with all endpoints
│   ├── types/
│   │   └── api.ts           # TypeScript type definitions
│   ├── hooks/
│   │   └── usePageTitle.ts  # Dynamic page title management hook
│   ├── lib/
│   │   └── utils.ts         # Utility functions and helpers
│   └── App.tsx              # Main app with routing and layout selection
├── public/                  # Static assets, favicon, and app icons
├── components.json          # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Running Face Clustering API (see ../api/README.md)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure API endpoint**:
The client is configured to connect to `http://localhost:5000` by default. Update the `VITE_API_BASE_URL` environment variable or `src/services/api.ts` if your API runs on a different endpoint.

3. **Set up favicon**:
Save your logo as `favicon.png` in the `public/` directory to replace the default favicon.

4. **Start development server**:
```bash
npm run dev
```

4. **Open browser**:
Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application  
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎯 Usage Guide

## 🎯 Usage Guide

### Basic Workflow

1. **Admin Setup**: 
   - Visit `/admin` to access administrative features
   - Create albums and sections for organization (optional)
   - Configure system settings and view statistics

2. **Upload Images**: 
   - Click "Choose Images" and select multiple photos
   - Optionally assign to specific album/section during upload
   - Images are processed automatically for face detection

3. **Browse Results**:
   - Visit main gallery (`/`) to see detected persons
   - Click on person cards to view detailed information
   - Browse all images with face detection status

4. **Manual Corrections**:
   - In person detail pages, click "Move Face" on any face
   - Choose to move to existing person or create new person
   - Rename persons by clicking the "Rename" button

5. **Organization**:
   - Create albums for event-based organization
   - Use sections for sub-categorization within albums
   - Filter gallery views by albums, sections, or search terms

6. **Advanced Features**:
   - Use "Search by Image" to find similar faces
   - Trigger "Cluster Faces" to re-run automatic clustering
   - View comprehensive statistics on your gallery

### Key Features Explained

#### Face Search
- **Upload Search Image**: Use any photo to find similar faces
- **Adjustable Tolerance**: Control search sensitivity
- **Confidence Scores**: Results ranked by similarity confidence
- **Multiple Match Results**: Find all similar faces across your gallery

#### Face Movement
- **Move to Existing Person**: Reassign face to another detected person
- **Create New Person**: Extract face to form a new person
- **Auto-cleanup**: Person with no faces left is automatically deleted
- **Protected Assignments**: Manual moves are preserved during clustering

#### Album & Section Organization  
- **Hierarchical Structure**: Albums can contain sections, sections contain images
- **Flexible Assignment**: Images can belong to albums, sections, or both
- **Filtering Support**: Filter gallery views by organization structure
- **Batch Operations**: Assign multiple images during upload

#### Protected Manual Assignments  
- Faces moved manually are marked as `is_manual_assignment: true`
- Clustering algorithms skip manually assigned faces
- Your corrections won't be lost during re-clustering
- Manual assignments preserve person names and relationships

#### Smart Navigation
- Moving a face automatically redirects to the target person
- Modal dialogs close properly before navigation
- Seamless user experience with immediate feedback
- Breadcrumb navigation for complex hierarchies

## 🔧 Configuration

### API Configuration
Update the API base URL using environment variables:

Create a `.env.local` file:
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_TITLE=Fansat
VITE_MAX_UPLOAD_SIZE=16777216
```

Or update directly in `src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### Dynamic Page Titles
Page titles are automatically managed by the `usePageTitle` hook:
- **Gallery**: "Fansat | Gallery"
- **Admin**: "Fansat | Admin"
- **Persons**: "Fansat | Persons" or "Fansat | Persons - Admin"
- **Person Details**: "Fansat | [Person Name]"
- **Albums**: "Fansat | Albums - Admin"
- **Sections**: "Fansat | Sections - Admin"

### Styling
The app uses Tailwind CSS with shadcn/ui components. Customize styles in:
- `tailwind.config.ts` - Tailwind configuration
- `src/index.css` - Global styles
- Component files - Component-specific styling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Environment Configuration
Create a `.env.local` file for environment-specific settings:
```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=Fansat
VITE_MAX_UPLOAD_SIZE=16777216
VITE_UPLOAD_TIMEOUT=300000
```

### Deployment Options

#### Static Hosting Services
- **Vercel**: 
  ```bash
  vercel --prod
  ```
- **Netlify**: Drag and drop `dist/` folder or connect to Git
- **GitHub Pages**: Upload `dist/` contents to gh-pages branch
- **Cloudflare Pages**: Connect repository for automatic deployments

#### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Server Configuration
For SPA routing, configure your server to serve `index.html` for all routes:

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache**:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Performance Optimization
- **Code Splitting**: Automatic route-based code splitting with React.lazy
- **Tree Shaking**: Unused code elimination in production builds
- **Asset Optimization**: Image and CSS optimization with Vite
- **Caching Strategy**: Proper cache headers for static assets
- **Upload Optimization**: Client-side file validation and progress tracking

## 🤝 API Integration

The client communicates with the Face Clustering API through these endpoints:

### Core Features
- `POST /images/upload` - Single image upload with face detection
- `POST /images/upload-multiple` - Batch image upload
- `POST /images/search-by-image` - Find similar faces using uploaded image
- `GET /images/` - Fetch all images with filtering options
- `GET /images/<id>` - Get detailed image information

### Person Management
- `GET /persons/` - Fetch all persons with thumbnails and statistics
- `GET /persons/<id>` - Get person details with all faces and images
- `PUT /persons/<id>/rename` - Rename person with custom name

### Face Operations
- `GET /faces/<filename>` - Serve cropped face images
- `PUT /faces/<id>/move` - Move face to existing person (manual assignment)
- `PUT /faces/<id>/move-to-new` - Move face to new person

### Organization
- `GET /albums/` - Fetch all albums with image counts
- `POST /albums/` - Create new album
- `PUT /albums/<id>` - Update album details
- `DELETE /albums/<id>` - Delete album
- `GET /sections/` - Fetch all sections with image counts
- `POST /sections/` - Create new section
- `PUT /sections/<id>` - Update section details
- `DELETE /sections/<id>` - Delete section

### System Operations
- `GET /cluster/` - Trigger face clustering (preserves manual assignments)
- `POST /cluster/preview` - Preview clustering results with custom parameters
- `GET /stats/` - Get comprehensive database statistics
- `DELETE /reset` - Reset entire database (admin only)

### API Service Features
- **Request Timeouts**: Extended timeouts for upload operations (3 minutes single, 5 minutes multiple)
- **Upload Progress**: Real-time progress tracking with onUploadProgress callbacks
- **Error Handling**: Comprehensive error catching with user-friendly messages
- **Type Safety**: Full TypeScript integration with API response types
- **URL Helpers**: Utility functions for image and face URL generation using IDs

## 📝 TypeScript Support

Full TypeScript support with:
- **Strict type checking** enabled
- **API response types** defined in `src/types/api.ts`
- **Component props** fully typed
- **IDE intellisense** for better development experience

## 🎨 UI Components

Built with shadcn/ui components for consistent, accessible design:

### Form Components
- **Button** - Interactive buttons with variants (primary, secondary, destructive)
- **Input** - Form inputs with validation styles and error states
- **Select** - Dropdown selectors for albums, sections, and persons
- **Label** - Accessible form labels with proper associations

### Layout Components
- **Card** - Content containers with proper spacing and elevation
- **Dialog** - Modal components for face movement and confirmations
- **Navigation Menu** - Responsive navigation with active states
- **Popover** - Contextual overlays for additional information

### Data Display
- **Badge** - Status indicators and count displays
- **Avatar** - Person thumbnails with fallback states
- **Grid Layouts** - Responsive image and person grids
- **Statistics Cards** - Real-time data visualization

### Interactive Elements
- **Toast Notifications** - Success, error, and info messages
- **Loading Spinners** - Visual feedback for async operations
- **Progress Indicators** - Upload and processing progress
- **Hover Effects** - Smooth transitions and interactive feedback

### Accessibility Features
- **Keyboard Navigation** - Full keyboard accessibility support
- **Screen Reader Support** - Proper ARIA labels and descriptions
- **Focus Management** - Logical tab order and focus indicators
- **Color Contrast** - WCAG compliant color schemes

## 🔍 Development

### Development Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npm run build  # Will fail on type errors
```

### Development Features
- **Hot Module Replacement**: Instant updates without page refresh
- **TypeScript Integration**: Real-time type checking in development
- **ESLint Configuration**: Code quality and consistency enforcement
- **Pretty Error Overlay**: Detailed error information in development
- **Source Maps**: Easy debugging with original source mapping

### Code Quality Tools
```bash
# Linting with auto-fix
npm run lint -- --fix

# Type checking without building
npx tsc --noEmit

# Format code (if Prettier is configured)
npm run format
```

### Browser Development Tools
- **React Developer Tools**: Component inspection and profiling
- **Redux DevTools**: State management debugging (if Redux is used)
- **Network Tab**: API request monitoring and debugging
- **Performance Tab**: Component rendering performance analysis

### Debugging Tips
- Use React.StrictMode for development warnings
- Enable detailed error boundaries for better error handling
- Implement proper loading states for better UX during development
- Use browser's console for API response debugging

---

## 📄 Original Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
