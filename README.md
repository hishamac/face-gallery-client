# Face Recognition Gallery Client

A modern React-based web application for face recognition and photo organization. Built with TypeScript, React Router, and Vite for a fast, responsive user experience with comprehensive face management capabilities.

## Features

- **Gallery View**: Browse and organize your photo collection with face recognition overlays
- **Person Management**: View, edit, and organize detected persons from your photos
- **Face Recognition**: Advanced AI-powered face detection and clustering
- **Admin Dashboard**: Complete administrative controls for system management
- **Search by Image**: Upload an image to find similar faces in your collection
- **Album & Section Organization**: Organize images into albums and sections
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live feedback for all operations and face detection results

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router 7.9
- **Build Tool**: Vite 7.1 for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **API Client**: Axios for HTTP requests
- **Icons**: Lucide React for consistent iconography

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

- `VITE_API_BASE_URL`: Backend API endpoint (defaults to http://localhost:5000)

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

Build files will be generated in the `dist` directory.

## Page Documentation

The application features a dual-layout system with user and admin interfaces, providing comprehensive face recognition and photo management capabilities.

### Navigation Structure

The app uses two distinct layouts:
- **User Layout**: Standard navigation for regular users (Gallery, Persons)
- **Admin Layout**: Extended navigation with administrative controls

#### User Navigation
- **Gallery** (`/`) - Main photo gallery with filtering and search
- **Persons** (`/persons`) - Person management and editing

#### Admin Navigation  
- **Admin Dashboard** (`/admin`) - System control center
- **Gallery** (`/admin/gallery`) - Admin gallery view
- **Persons** (`/admin/persons`) - Person management with admin tools
- **Albums** (`/admin/albums`) - Album organization
- **Sections** (`/admin/sections`) - Section management

### Detailed Page Features

#### 1. Gallery Page (`/` and `/admin/gallery`)
**Primary Features:**
- **Responsive Grid Layout**: Masonry-style image display with hover effects
- **File Upload Interface**: Drag-and-drop or click-to-upload with progress tracking
- **Advanced Filtering System**:
  - Filter by persons (with face counts)
  - Filter by albums and sections
  - Show/hide images without faces
  - Multi-select filtering options
- **Search by Image**: Upload an image to find similar faces with confidence scores
- **Face Detection Overlays**: Toggle face rectangles with person names on images
- **Image Actions**: Click images to view detailed information

**Technical Implementation:**
- Real-time upload progress with file validation
- Dynamic filtering with URL persistence
- Lazy loading for performance optimization
- Responsive design with mobile-friendly touch interactions

#### 2. Persons Page (`/persons` and `/admin/persons`)
**Primary Features:**
- **Person Grid View**: Thumbnail-based person display with face counts
- **Inline Person Editing**: Click-to-edit person names with immediate feedback
- **Search Functionality**: Real-time person name filtering
- **Statistics Display**: Total persons and face counts
- **Person Navigation**: Click thumbnails to view detailed person pages

**Technical Implementation:**
- Debounced search input for performance
- Optimistic UI updates for name changes
- Error handling with user feedback
- Responsive card layout

#### 3. Person Detail Page (`/persons/:id`)
**Primary Features:**
- **Person Information Header**: Name, total faces, and images count
- **Person Renaming**: Edit person names with validation
- **Face Gallery**: Grid display of all faces for the person
- **Face Management Tools**:
  - Move faces to existing persons (with dropdown selection)
  - Move faces to new persons (with custom naming)
  - Delete individual faces
- **Image Navigation**: Click faces to view source images
- **Batch Operations**: Select multiple faces for bulk actions

**Technical Implementation:**
- Real-time face count updates
- Drag-and-drop face management
- Confirmation dialogs for destructive actions
- Dynamic person selection with search

#### 4. Image Detail Page (`/images/:id`)
**Primary Features:**
- **Full Image Display**: High-resolution image viewing with zoom capabilities
- **Interactive Face Overlays**: 
  - Hover to highlight faces
  - Click faces for management options
  - Real-time face boundary updates
- **Face Management Panel**:
  - Move faces between persons
  - Create new persons from faces
  - Delete faces with confirmation
- **Image Actions**:
  - Re-detect faces with multiple algorithms
  - Delete entire image
  - View image metadata
- **Related Images**: Navigate to other images with same persons

**Technical Implementation:**
- Canvas-based face overlay rendering
- Real-time coordinate updates
- Multiple face detection algorithms
- Responsive image scaling

#### 5. Admin Dashboard (`/admin`)
**Primary Features:**
- **System Statistics**: 
  - Total images, faces, and persons counts
  - Images with/without faces breakdown
  - Processing status indicators
- **Bulk Upload Interface**:
  - Multiple file selection with preview
  - Album/section assignment during upload
  - Progress tracking for batch operations
- **Face Clustering Tools**:
  - Trigger automatic face clustering
  - View clustering progress and results
  - Algorithm selection and configuration
- **Database Management**:
  - Reset database with confirmation
  - System health monitoring
  - Performance metrics display

**Technical Implementation:**
- Real-time statistics updates
- Background processing indicators
- Batch operation progress tracking
- Confirmation flows for destructive actions

#### 6. Albums Management (`/admin/albums`)
**Primary Features:**
- **Album CRUD Operations**:
  - Create new albums with names and descriptions
  - Edit existing album details inline
  - Delete albums with confirmation dialogs
- **Album Statistics**: Image count per album with visual indicators
- **Search and Filter**: Real-time album name filtering
- **Responsive Layout**: Card-based design with mobile optimization

**Technical Implementation:**
- Inline editing with immediate validation
- Optimistic UI updates with error recovery
- Sorted display with creation date information
- Delete confirmations with cascading warnings

#### 7. Sections Management (`/admin/sections`)
**Primary Features:**
- **Section CRUD Operations**:
  - Create sections with descriptive metadata
  - Inline editing for section details
  - Secure deletion with confirmation
- **Section Organization**: Visual hierarchy with usage statistics
- **Search Capabilities**: Filter sections by name with real-time results
- **Usage Analytics**: Display image count per section

**Technical Implementation:**
- Component reusability with Albums page
- Form validation with user feedback
- Error boundary handling for failed operations
- Responsive grid layout with consistent spacing

### Common UI Components

#### Navigation Components
- **Responsive Navbar**: Collapsible mobile menu with smooth transitions
- **Admin Navbar**: Extended navigation with admin-specific links
- **Breadcrumb Navigation**: Context-aware page hierarchy

#### Form Components
- **File Upload Zones**: Drag-and-drop with progress visualization
- **Search Inputs**: Debounced search with clear functionality
- **Modal Dialogs**: Confirmation and form dialogs with backdrop dismiss

#### Data Display
- **Statistics Cards**: Animated count displays with icons
- **Image Grids**: Responsive masonry layouts with lazy loading
- **Person Cards**: Thumbnail displays with metadata overlays

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Navbar, Footer, Layouts)
│   │   ├── Layout.tsx        # User layout wrapper
│   │   ├── AdminLayout.tsx   # Admin layout wrapper
│   │   ├── Navbar.tsx        # User navigation
│   │   ├── AdminNavbar.tsx   # Admin navigation
│   │   └── Footer.tsx        # Shared footer component
│   ├── ui/            # Reusable UI components (shadcn/ui)
│   ├── Gallery.tsx    # Main gallery page component
│   ├── Persons.tsx    # Person management page
│   ├── PersonDetail.tsx # Individual person detail page
│   ├── ImageDetail.tsx  # Individual image detail page
│   ├── Admin.tsx      # Admin dashboard
│   ├── Albums.tsx     # Album management page
│   └── Sections.tsx   # Section management page
├── hooks/             # Custom React hooks
│   └── usePageTitle.ts # Dynamic page title management
├── lib/               # Utility functions
│   └── utils.ts       # Common utility functions
├── services/          # API service layer
│   └── api.ts         # Complete API client with all endpoints
└── types/            # TypeScript type definitions
    └── api.ts         # API response type definitions
```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint with TypeScript support

## API Integration

The client communicates with a Flask-based backend API that provides:

- **Image Management**: Upload, storage, and retrieval with metadata
- **Face Detection**: Multiple algorithm support with confidence scoring
- **Face Recognition**: Similarity matching and clustering capabilities
- **Person Management**: CRUD operations for person entities
- **Organization**: Album and section management
- **Statistics**: Comprehensive analytics and system monitoring

### Key API Endpoints
- `POST /images/upload` - Single image upload with face detection
- `POST /images/upload-multiple` - Batch image processing
- `POST /images/search-by-image` - Face similarity search
- `GET /persons` - Retrieve all persons with statistics
- `PUT /faces/{id}/move` - Move faces between persons
- `GET /cluster` - Trigger face clustering algorithms
- `DELETE /reset` - Database reset functionality

## Features Overview

### Gallery Management
- Upload single or multiple images with preview
- View photos with interactive face detection overlays  
- Advanced search and filtering by persons, albums, sections
- Responsive grid layout with lazy loading
- Search by image functionality with similarity matching

### Person Recognition
- Automatic face detection using multiple algorithms
- Intelligent face clustering and person assignment
- Person renaming and organization tools
- Face management with move and delete operations
- Person-specific galleries with detailed statistics

### Administrative Tools
- Comprehensive system statistics dashboard
- Database management with reset capabilities
- Batch upload operations with progress tracking
- Face clustering configuration and monitoring
- Album and section organization tools

### User Experience
- Responsive design optimized for all devices
- Real-time updates with optimistic UI patterns
- Error handling with user-friendly feedback
- Progressive loading for better performance
- Keyboard navigation support

## License

[Add your license information here]