# Face Clustering React Client

A modern React TypeScript application for intelligent face clustering and management. This client provides an intuitive interface to upload images, automatically detect and cluster faces, and manually manage person assignments.

## 🚀 Features

### Core Functionality
- **Image Upload & Processing**: Upload multiple images with automatic face detection
- **Smart Face Clustering**: Uses face recognition algorithms to group similar faces automatically
- **Person Management**: View all detected persons with their associated faces and images
- **Image Gallery**: Browse all uploaded images with face detection information

### Advanced Features
- **Manual Face Management**: Move faces between persons or create new persons when clustering is incorrect
- **Person Renaming**: Rename persons with custom names (preserved during reclustering)  
- **Protected Manual Assignments**: Manual face assignments are protected from automatic reclustering
- **Auto-cleanup**: Empty persons are automatically deleted when their last face is moved

### User Interface
- **Person Detail Pages**: View all faces and images for each person
- **Image Detail Pages**: See all detected faces in each image with person links
- **Interactive Face Management**: Click-to-move faces with intuitive modal dialogs
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and TypeScript
- **TypeScript** - Type-safe development
- **Vite** - Fast development and build tool
- **React Router** - Client-side routing for SPA navigation
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **Axios** - HTTP client for API communication

## 📁 Project Structure

```
client/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Gallery.tsx      # Main gallery view
│   │   ├── PersonDetail.tsx # Person detail page
│   │   └── ImageDetail.tsx  # Image detail page
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   └── api.ts           # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── App.tsx              # Main app with routing
├── public/                  # Static assets
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
The client is configured to connect to `http://localhost:5000` by default. Update `src/services/api.ts` if your API runs on a different port.

3. **Start development server**:
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

### Basic Workflow

1. **Upload Images**: 
   - Click "Choose Images" and select multiple photos
   - Images are processed automatically for face detection

2. **View Results**:
   - Browse the gallery to see detected persons
   - Click on person cards to view detailed information

3. **Manual Corrections**:
   - In person detail pages, click "Move Face" on any face
   - Choose to move to existing person or create new person
   - Rename persons by clicking the "Rename" button

4. **Clustering**:
   - Use "Cluster Faces" to re-run automatic clustering
   - Manual assignments are preserved during reclustering

### Key Features Explained

#### Face Movement
- **Move to Existing Person**: Reassign face to another detected person
- **Create New Person**: Extract face to form a new person
- **Auto-cleanup**: Person with no faces left is automatically deleted

#### Protected Manual Assignments  
- Faces moved manually are marked as `is_manual_assignment: true`
- Clustering algorithms skip manually assigned faces
- Your corrections won't be lost during re-clustering

#### Smart Navigation
- Moving a face automatically redirects to the target person
- Modal dialogs close properly before navigation
- Seamless user experience with immediate feedback

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5000';
```

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

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Upload `dist/` contents
- **Docker**: Use provided Dockerfile

## 🤝 API Integration

The client communicates with the Face Clustering API through these endpoints:

- `GET /gallery` - Fetch all persons and faces
- `GET /person/<id>` - Get person details  
- `GET /image/<id>` - Get image details
- `PUT /person/<id>/rename` - Rename person
- `PUT /face/<id>/move-to-person` - Move face to existing person
- `PUT /face/<id>/move-to-new-person` - Move face to new person
- `POST /upload` - Upload and process images
- `GET /cluster` - Trigger face clustering

## 📝 TypeScript Support

Full TypeScript support with:
- **Strict type checking** enabled
- **API response types** defined in `src/types/api.ts`
- **Component props** fully typed
- **IDE intellisense** for better development experience

## 🎨 UI Components

Built with shadcn/ui components:
- **Button** - Interactive buttons with variants
- **Card** - Content containers with proper spacing
- **Input** - Form inputs with validation styles
- **Modal dialogs** - Accessible modal components

## 🔍 Development

### React Compiler
Note: The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking progress.

### ESLint Configuration
For production applications, enable type-aware lint rules by updating the ESLint configuration as shown in the original template documentation below.

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
