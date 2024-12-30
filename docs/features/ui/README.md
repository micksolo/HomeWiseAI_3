# User Interface

## Overview

HomeWise AI's user interface is built with React and TypeScript, providing a modern, responsive, and accessible experience.

## Components

### 1. Layout Components

```typescript
interface LayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
  header?: boolean;
  footer?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  sidebar = true,
  header = true,
  footer = true,
}) => {
  return (
    <div className="layout">
      {header && <Header />}
      <div className="content">
        {sidebar && <Sidebar />}
        <main>{children}</main>
      </div>
      {footer && <Footer />}
    </div>
  );
};
```

### 2. Device Cards

```typescript
interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="device-card">
      <div className="device-info">
        <h3>{device.name}</h3>
        <p>{device.type}</p>
      </div>
      <div className="device-controls">
        <Switch
          checked={device.isOn}
          onChange={() => onToggle(device.id)}
        />
        <IconButton
          icon="edit"
          onClick={() => onEdit(device.id)}
        />
        <IconButton
          icon="delete"
          onClick={() => onDelete(device.id)}
        />
      </div>
    </div>
  );
};
```

### 3. Forms

```typescript
interface DeviceFormProps {
  device?: Device;
  onSubmit: (data: DeviceFormData) => void;
  onCancel: () => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DeviceFormData>({
    name: device?.name ?? '',
    type: device?.type ?? '',
    room: device?.room ?? '',
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({
          ...formData,
          name: e.target.value,
        })}
      />
      <Select
        label="Type"
        value={formData.type}
        options={deviceTypes}
        onChange={(value) => setFormData({
          ...formData,
          type: value,
        })}
      />
      <Select
        label="Room"
        value={formData.room}
        options={rooms}
        onChange={(value) => setFormData({
          ...formData,
          room: value,
        })}
      />
      <div className="form-actions">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
```

## State Management

### 1. Store Configuration

```typescript
interface RootState {
  devices: DevicesState
  rooms: RoomsState
  ui: UIState
}

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    rooms: roomsReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiMiddleware),
})
```

### 2. Slices

```typescript
const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload
    },
    updateDevice: (state, action: PayloadAction<Device>) => {
      const index = state.devices.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.devices[index] = action.payload
      }
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(d => d.id !== action.payload)
    },
  },
})
```

## Styling

### 1. Theme Configuration

```typescript
const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
}
```

### 2. Component Styles

```typescript
const StyledDeviceCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`
```

## Accessibility

### 1. ARIA Labels

```typescript
const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      {children}
    </button>
  );
};
```

### 2. Keyboard Navigation

```typescript
const KeyboardNav: React.FC = ({ children }) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        // Navigate to previous item
        break;
      case 'ArrowDown':
        // Navigate to next item
        break;
      case 'Enter':
        // Activate current item
        break;
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      role="navigation"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
```

## Testing

### 1. Component Tests

```typescript
describe('DeviceCard', () => {
  it('renders device information correctly', () => {
    const device = {
      id: '1',
      name: 'Living Room Light',
      type: 'light',
      isOn: true,
    };

    render(<DeviceCard device={device} />);

    expect(screen.getByText('Living Room Light')).toBeInTheDocument();
    expect(screen.getByText('light')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('handles toggle action', () => {
    const onToggle = jest.fn();
    const device = {
      id: '1',
      name: 'Living Room Light',
      type: 'light',
      isOn: false,
    };

    render(<DeviceCard device={device} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith('1');
  });
});
```

### 2. Integration Tests

```typescript
describe('DeviceList', () => {
  it('loads and displays devices', async () => {
    const devices = [
      { id: '1', name: 'Device 1' },
      { id: '2', name: 'Device 2' },
    ];

    server.use(
      rest.get('/api/devices', (req, res, ctx) => {
        return res(ctx.json(devices));
      })
    );

    render(<DeviceList />);

    expect(await screen.findByText('Device 1')).toBeInTheDocument();
    expect(screen.getByText('Device 2')).toBeInTheDocument();
  });
});
```

## Performance

### 1. Memoization

```typescript
const MemoizedDeviceCard = React.memo(DeviceCard, (prev, next) => {
  return (
    prev.device.id === next.device.id &&
    prev.device.isOn === next.device.isOn &&
    prev.device.name === next.device.name
  )
})
```

### 2. Code Splitting

```typescript
const DeviceSettings = React.lazy(() =>
  import('./DeviceSettings')
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/settings"
          element={<DeviceSettings />}
        />
      </Routes>
    </Suspense>
  );
};
```
