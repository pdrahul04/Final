# Project Management UI Components

A comprehensive React component library for building project management applications, inspired by Jira and modern task management tools.

## 🚀 Features

- **Complete Task Management** - Kanban boards, drag & drop, task CRUD operations
- **Scrum Workflow** - Backlog management, sprint planning, sprint lifecycle
- **Professional UI Components** - Buttons, modals, cards, search bars, and more
- **TypeScript Support** - Full type safety and IntelliSense
- **Comprehensive Testing** - Unit tests with Vitest and Testing Library
- **Responsive Design** - Mobile-first approach with modern CSS

## 📦 Installation

```bash
npm install project-management-ui
# or
yarn add project-management-ui
```

## 🎯 Quick Start

```tsx
import { Button, Modal, Card, SearchBar } from 'project-management-ui';

function App() {
  return (
    <div>
      <Button variant="primary" icon={Plus}>
        Create Task
      </Button>
      
      <SearchBar
        onSearch={(query) => console.log(query)}
        placeholder="Search tasks..."
      />
      
      <Card hover padding="lg">
        <h3>Task Card</h3>
        <p>Task description here...</p>
      </Card>
    </div>
  );
}
```

## 🧩 Components

### Core Components

- **Button** - Versatile button with variants, sizes, icons, and loading states
- **Modal** - Accessible modal with keyboard navigation and overlay click handling
- **Card** - Flexible card component with hover effects and click handling
- **SearchBar** - Advanced search with filtering capabilities
- **LoadingSpinner** - Customizable loading indicators

### Form Components

- **FormGroup** - Form field wrapper with validation
- **FormLabel** - Accessible form labels
- **FormInput** - Enhanced input fields
- **FormTextarea** - Multi-line text inputs
- **FormSelect** - Dropdown selections

### Layout Components

- **Sidebar** - Collapsible navigation sidebar
- **Header** - Application header with branding
- **Container** - Responsive content containers

### Drag & Drop Components

- **DraggableItem** - Make any component draggable
- **DroppableZone** - Create drop targets
- **DragOverlay** - Visual feedback during dragging

## 🎨 Styling

The library includes a complete CSS framework with:

- **Design System** - Consistent colors, typography, and spacing
- **Component Variants** - Multiple styles for each component
- **Responsive Design** - Mobile-first breakpoints
- **Dark Mode Ready** - CSS custom properties for theming

## 🧪 Testing

All components include comprehensive tests:

```bash
npm test              # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 📚 API Reference

### Button Props

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
```

### Modal Props

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

### SearchBar Props

```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  placeholder?: string;
  filters?: FilterConfig[];
}
```

## 🎯 Examples

### Task Management Board

```tsx
import { DndContext } from '@dnd-kit/core';
import { DraggableItem, DroppableZone, Card } from 'project-management-ui';

function TaskBoard() {
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board-columns">
        <DroppableZone id="todo">
          <h3>To Do</h3>
          {todoTasks.map(task => (
            <DraggableItem key={task.id} id={task.id}>
              <Card hover>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </Card>
            </DraggableItem>
          ))}
        </DroppableZone>
      </div>
    </DndContext>
  );
}
```

### Search with Filters

```tsx
import { SearchBar } from 'project-management-ui';

const filters = [
  {
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  }
];

function TaskSearch() {
  return (
    <SearchBar
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      filters={filters}
      placeholder="Search tasks..."
    />
  );
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build library
npm run build:lib

# Build documentation
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new components
4. Ensure all tests pass
5. Submit a pull request

## 🔗 Links

- [Documentation](https://project-management-ui.dev)
- [GitHub Repository](https://github.com/your-org/project-management-ui)
- [NPM Package](https://www.npmjs.com/package/project-management-ui)
- [Storybook](https://storybook.project-management-ui.dev)

---

Built with ❤️ for modern React applications
