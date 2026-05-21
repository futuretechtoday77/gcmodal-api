// Template Configuration
// Defines all available popup templates

export const templates = [
  {
    id: 'clean-gradient',
    name: 'Clean Gradient',
    description: 'Simple gradient background with centered form',
    category: 'minimal',
    preview: '/templates/previews/clean-gradient.jpg',
    config: {
      type: 'gradient',
      layout: 'centered',
      mobileBehavior: 'stack',
      showImageOnMobile: false,
      hasAvatar: false,
      defaultVariant: 'purple',
      fields: ['email', 'firstName'],
      styling: {
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px'
      }
    }
  },
  {
    id: 'split-screen',
    name: 'Split Screen',
    description: 'Image on left, form on right. Image hides on mobile.',
    category: 'image',
    preview: '/templates/previews/split-screen.jpg',
    config: {
      type: 'split',
      layout: 'side-by-side',
      mobileBehavior: 'stack-no-image',
      showImageOnMobile: false,
      hasAvatar: false,
      defaultVariant: 'blue',
      fields: ['email', 'firstName', 'phone'],
      styling: {
        borderRadius: '12px',
        imageWidth: '45%',
        maxWidth: '700px'
      }
    }
  },
  {
    id: 'ultra-minimal',
    name: 'Ultra Minimal',
    description: 'Text only, single field. Maximum conversion.',
    category: 'minimal',
    preview: '/templates/previews/ultra-minimal.jpg',
    config: {
      type: 'minimal',
      layout: 'centered',
      mobileBehavior: 'stack',
      showImageOnMobile: false,
      hasAvatar: false,
      defaultVariant: 'white',
      fields: ['email'],
      styling: {
        borderRadius: '8px',
        padding: '30px',
        maxWidth: '400px',
        background: 'white'
      }
    }
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    description: 'Product image (book/mockup) with download form',
    category: 'product',
    preview: '/templates/previews/lead-magnet.jpg',
    config: {
      type: 'product',
      layout: 'centered',
      mobileBehavior: 'stack-small-image',
      showImageOnMobile: true,
      imagePosition: 'top',
      hasAvatar: false,
      defaultVariant: 'blue',
      fields: ['email', 'firstName'],
      styling: {
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px'
      }
    }
  },
  {
    id: 'personal-consultation',
    name: 'Personal Consultation',
    description: 'Professional photo with floating avatar icon',
    category: 'personal',
    preview: '/templates/previews/personal-consultation.jpg',
    config: {
      type: 'personal',
      layout: 'centered',
      mobileBehavior: 'stack',
      showImageOnMobile: true,
      imagePosition: 'header',
      hasAvatar: true,
      avatarPosition: 'bottom-left',
      defaultVariant: 'pink',
      fields: ['email', 'firstName'],
      styling: {
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px'
      }
    }
  },
  {
    id: 'full-background',
    name: 'Full Background',
    description: 'Full-bleed background image with overlay form',
    category: 'image',
    preview: '/templates/previews/full-background.jpg',
    config: {
      type: 'background',
      layout: 'overlay',
      mobileBehavior: 'stack',
      showImageOnMobile: true,
      hasAvatar: false,
      defaultVariant: 'dark',
      fields: ['email', 'firstName', 'phone'],
      styling: {
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        overlay: true
      }
    }
  },
  {
    id: 'full-background-tall',
    name: 'Full Background Tall',
    description: 'Taller version with more vertical space for content',
    category: 'image',
    preview: '/templates/previews/full-background-tall.jpg',
    config: {
      type: 'background',
      layout: 'overlay',
      mobileBehavior: 'stack',
      showImageOnMobile: true,
      hasAvatar: false,
      defaultVariant: 'dark',
      fields: ['email', 'firstName', 'phone'],
      styling: {
        borderRadius: '12px',
        padding: '60px 40px',
        maxWidth: '500px',
        minHeight: '500px',
        overlay: true
      }
    }
  },
  {
    id: 'full-background-wide',
    name: 'Full Background Wide',
    description: 'Wider desktop view for more impact',
    category: 'image',
    preview: '/templates/previews/full-background-wide.jpg',
    config: {
      type: 'background',
      layout: 'overlay',
      mobileBehavior: 'stack',
      showImageOnMobile: true,
      hasAvatar: false,
      defaultVariant: 'dark',
      fields: ['email', 'firstName', 'phone'],
      styling: {
        borderRadius: '12px',
        padding: '40px 60px',
        maxWidth: '650px',
        overlay: true
      }
    }
  },
  {
    id: 'full-background-compact',
    name: 'Full Background Compact',
    description: 'Minimal height, just the essentials',
    category: 'image',
    preview: '/templates/previews/full-background-compact.jpg',
    config: {
      type: 'background',
      layout: 'overlay',
      mobileBehavior: 'stack',
      showImageOnMobile: true,
      hasAvatar: false,
      defaultVariant: 'dark',
      fields: ['email'],
      styling: {
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '450px',
        minHeight: '250px',
        overlay: true
      }
    }
  }
]

export const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'image', name: 'With Image' },
  { id: 'product', name: 'Product/Lead Magnet' },
  { id: 'personal', name: 'Personal/Consultation' }
]

export const fieldOptions = [
  { id: 'email', name: 'Email', required: true },
  { id: 'firstName', name: 'First Name', required: false },
  { id: 'lastName', name: 'Last Name', required: false },
  { id: 'phone', name: 'Phone Number', required: false }
]

export const colorVariants = {
  // High contrast professional themes
  professional: { 
    name: 'Professional (White/Dark)', 
    primary: '#1f2937', 
    secondary: '#4b5563', 
    bg: '#ffffff',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#2563eb'
  },
  professionalBlue: { 
    name: 'Professional Blue', 
    primary: '#1e40af', 
    secondary: '#3b82f6', 
    bg: '#ffffff',
    text: '#1e3a8a',
    textLight: '#64748b',
    accent: '#2563eb'
  },
  darkMode: { 
    name: 'Dark Mode', 
    primary: '#ffffff', 
    secondary: '#e5e7eb', 
    bg: '#111827',
    text: '#ffffff',
    textLight: '#9ca3af',
    accent: '#3b82f6'
  },
  // Clean minimal
  clean: { 
    name: 'Clean Minimal', 
    primary: '#000000', 
    secondary: '#374151', 
    bg: '#ffffff',
    text: '#111827',
    textLight: '#6b7280',
    accent: '#000000'
  },
  // Original pastel themes (kept for compatibility)
  purple: { name: 'Purple', primary: '#7c3aed', secondary: '#a78bfa', bg: '#faf5ff', text: '#7c3aed', textLight: '#a78bfa' },
  blue: { name: 'Blue', primary: '#2563eb', secondary: '#60a5fa', bg: '#eff6ff', text: '#2563eb', textLight: '#60a5fa' },
  green: { name: 'Green', primary: '#059669', secondary: '#34d399', bg: '#ecfdf5', text: '#059669', textLight: '#34d399' },
  red: { name: 'Red', primary: '#dc2626', secondary: '#f87171', bg: '#fef2f2', text: '#dc2626', textLight: '#f87171' },
  orange: { name: 'Orange', primary: '#ea580c', secondary: '#fb923c', bg: '#fff7ed', text: '#ea580c', textLight: '#fb923c' },
  pink: { name: 'Pink', primary: '#db2777', secondary: '#f472b6', bg: '#fdf2f8', text: '#db2777', textLight: '#f472b6' },
  dark: { name: 'Dark', primary: '#1f2937', secondary: '#4b5563', bg: '#111827', text: '#ffffff', textLight: '#9ca3af' },
  white: { name: 'White', primary: '#2563eb', secondary: '#60a5fa', bg: '#ffffff', text: '#1f2937', textLight: '#6b7280' }
}
