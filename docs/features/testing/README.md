# Testing Documentation

## Overview

HomeWise AI implements comprehensive testing strategies across all layers of the application.

## Unit Testing

### 1. Component Testing

```typescript
describe('DeviceCard', () => {
  const mockDevice = {
    id: '1',
    name: 'Living Room Light',
    type: 'light',
    state: { power: 'on' },
  };

  it('renders device information', () => {
    const { getByText } = render(
      <DeviceCard device={mockDevice} />
    );

    expect(getByText('Living Room Light')).toBeInTheDocument();
    expect(getByText('light')).toBeInTheDocument();
  });

  it('handles device state changes', () => {
    const onToggle = vi.fn();
    const { getByRole } = render(
      <DeviceCard
        device={mockDevice}
        onToggle={onToggle}
      />
    );

    fireEvent.click(getByRole('switch'));
    expect(onToggle).toHaveBeenCalledWith('1', 'off');
  });
});
```

### 2. Service Testing

```typescript
describe('DeviceService', () => {
  let deviceService: DeviceService
  let mockRepository: MockDeviceRepository

  beforeEach(() => {
    mockRepository = new MockDeviceRepository()
    deviceService = new DeviceService(mockRepository)
  })

  it('creates a device', async () => {
    const device = {
      name: 'Test Device',
      type: 'switch',
    }

    const created = await deviceService.createDevice(device)
    expect(created).toMatchObject(device)
    expect(created.id).toBeDefined()
  })

  it('updates device state', async () => {
    const device = await deviceService.createDevice({
      name: 'Test Device',
      type: 'light',
    })

    const updated = await deviceService.updateState(device.id, { power: 'on' })

    expect(updated.state.power).toBe('on')
  })
})
```

## Integration Testing

### 1. API Testing

```typescript
describe('Device API', () => {
  let app: Express
  let token: string

  beforeAll(async () => {
    app = await createTestApp()
    token = await generateTestToken()
  })

  it('creates and retrieves devices', async () => {
    // Create device
    const createResponse = await request(app)
      .post('/api/devices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Device',
        type: 'light',
      })

    expect(createResponse.status).toBe(201)
    const deviceId = createResponse.body.id

    // Retrieve device
    const getResponse = await request(app)
      .get(`/api/devices/${deviceId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getResponse.status).toBe(200)
    expect(getResponse.body).toMatchObject({
      id: deviceId,
      name: 'Test Device',
      type: 'light',
    })
  })

  it('handles device state updates', async () => {
    const device = await createTestDevice(app, token)

    const response = await request(app)
      .put(`/api/devices/${device.id}/state`)
      .set('Authorization', `Bearer ${token}`)
      .send({ power: 'on' })

    expect(response.status).toBe(200)
    expect(response.body.state.power).toBe('on')
  })
})
```

### 2. Database Testing

```typescript
describe('DeviceRepository', () => {
  let db: TestDatabase
  let repository: DeviceRepository

  beforeEach(async () => {
    db = await createTestDatabase()
    repository = new DeviceRepository(db)
  })

  afterEach(async () => {
    await db.cleanup()
  })

  it('persists device data', async () => {
    const device = {
      name: 'Test Device',
      type: 'sensor',
      config: { interval: 5000 },
    }

    const saved = await repository.save(device)
    expect(saved.id).toBeDefined()

    const retrieved = await repository.findById(saved.id)
    expect(retrieved).toMatchObject(device)
  })

  it('handles concurrent updates', async () => {
    const device = await repository.save({
      name: 'Test Device',
      type: 'light',
    })

    await Promise.all([
      repository.updateState(device.id, { power: 'on' }),
      repository.updateState(device.id, { brightness: 80 }),
    ])

    const updated = await repository.findById(device.id)
    expect(updated.state).toMatchObject({
      power: 'on',
      brightness: 80,
    })
  })
})
```

## End-to-End Testing

### 1. UI Testing

```typescript
describe('Device Management', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000')
    await login(page)
  })

  it('adds and controls devices', async () => {
    // Add device
    await page.click('[data-testid="add-device"]')
    await page.fill('[name="deviceName"]', 'Living Room Light')
    await page.selectOption('[name="deviceType"]', 'light')
    await page.click('[type="submit"]')

    // Verify device added
    await expect(page.locator('text=Living Room Light')).toBeVisible()

    // Control device
    await page.click('[data-testid="device-power"]')
    await expect(page.locator('[data-testid="device-status"]')).toHaveText('ON')
  })

  it('manages device groups', async () => {
    // Create group
    await page.click('[data-testid="create-group"]')
    await page.fill('[name="groupName"]', 'Living Room')
    await page.click('[data-testid="select-devices"]')
    await page.click('text=Living Room Light')
    await page.click('[type="submit"]')

    // Verify group
    await expect(page.locator('text=Living Room')).toBeVisible()

    // Control group
    await page.click('[data-testid="group-power"]')
    await expect(page.locator('[data-testid="group-status"]')).toHaveText('All ON')
  })
})
```

### 2. System Testing

```typescript
describe('System Integration', () => {
  let system: TestSystem

  beforeAll(async () => {
    system = await TestSystem.create({
      database: true,
      mqtt: true,
      redis: true,
    })
  })

  afterAll(async () => {
    await system.cleanup()
  })

  it('handles device events', async () => {
    // Create virtual device
    const device = await system.createVirtualDevice({
      type: 'light',
      protocol: 'mqtt',
    })

    // Subscribe to events
    const events: DeviceEvent[] = []
    await system.subscribeToEvents(event => {
      events.push(event)
    })

    // Trigger device state change
    await device.setState({ power: 'on' })

    // Verify event propagation
    await waitFor(() => {
      expect(events).toContainEqual({
        type: 'STATE_CHANGED',
        deviceId: device.id,
        state: { power: 'on' },
      })
    })

    // Verify database state
    const savedState = await system.getDeviceState(device.id)
    expect(savedState).toEqual({ power: 'on' })
  })

  it('executes automation rules', async () => {
    // Create devices
    const sensor = await system.createVirtualDevice({
      type: 'sensor',
      protocol: 'mqtt',
    })
    const light = await system.createVirtualDevice({
      type: 'light',
      protocol: 'mqtt',
    })

    // Create automation rule
    await system.createRule({
      trigger: {
        device: sensor.id,
        condition: 'motion_detected',
      },
      action: {
        device: light.id,
        command: { power: 'on' },
      },
    })

    // Trigger sensor event
    await sensor.triggerEvent('motion_detected')

    // Verify light state
    await waitFor(async () => {
      const lightState = await system.getDeviceState(light.id)
      expect(lightState.power).toBe('on')
    })
  })
})
```

## Performance Testing

### 1. Load Testing

```typescript
describe('API Performance', () => {
  let loadTest: LoadTest

  beforeEach(async () => {
    loadTest = await LoadTest.create({
      target: 'http://localhost:3000',
      users: 100,
      duration: '1m',
    })
  })

  it('handles concurrent device updates', async () => {
    const results = await loadTest.run({
      scenario: async context => {
        const deviceId = context.vars.deviceId
        await axios.put(`/api/devices/${deviceId}/state`, { power: context.vars.state })
      },
    })

    expect(results.errorRate).toBeLessThan(0.01) // 1%
    expect(results.p95).toBeLessThan(200) // 200ms
  })

  it('scales with increasing load', async () => {
    const baselineResults = await loadTest.run({
      users: 10,
      duration: '30s',
    })

    const scaledResults = await loadTest.run({
      users: 100,
      duration: '30s',
    })

    // Verify linear scaling
    const scaleFactor = scaledResults.throughput / baselineResults.throughput
    expect(scaleFactor).toBeGreaterThan(8) // 80% efficiency
  })
})
```

### 2. Memory Testing

```typescript
describe('Memory Usage', () => {
  let memTest: MemoryTest

  beforeEach(async () => {
    memTest = await MemoryTest.create()
  })

  it('maintains stable memory usage', async () => {
    const usage = await memTest.monitor(async () => {
      for (let i = 0; i < 1000; i++) {
        await processDeviceUpdate({
          id: `device-${i}`,
          state: { power: 'on' },
        })
      }
    })

    expect(usage.leak).toBeFalsy()
    expect(usage.heapUsed).toBeLessThan(100 * 1024 * 1024) // 100MB
  })

  it('handles large device networks', async () => {
    const devices = await createTestDevices(1000)
    const snapshot1 = await memTest.takeSnapshot()

    await updateAllDevices(devices)
    const snapshot2 = await memTest.takeSnapshot()

    expect(snapshot2.size - snapshot1.size).toBeLessThan(50 * 1024 * 1024) // 50MB growth
  })
})
```
