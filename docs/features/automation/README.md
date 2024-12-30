# Automation Features

## Overview

HomeWise AI provides powerful automation capabilities for creating smart home routines and scenarios.

## Rule Engine

### 1. Rule Definition

```typescript
interface AutomationRule {
  id: string
  name: string
  enabled: boolean
  trigger: Trigger
  conditions: Condition[]
  actions: Action[]
  schedule?: Schedule
}

interface Trigger {
  type: TriggerType
  source: string
  event: string
  parameters?: Record<string, any>
}

interface Condition {
  type: ConditionType
  device?: string
  property?: string
  operator: Operator
  value: any
}

interface Action {
  type: ActionType
  target: string
  command: string
  parameters?: Record<string, any>
}
```

### 2. Rule Execution

```rust
pub struct RuleEngine {
    rules: HashMap<String, AutomationRule>,
    context: ExecutionContext,
}

impl RuleEngine {
    pub async fn process_event(
        &self,
        event: Event,
    ) -> Result<Vec<Action>> {
        let mut actions = Vec::new();

        for rule in self.rules.values() {
            if !rule.enabled {
                continue;
            }

            if self.matches_trigger(rule, &event)
                && self.evaluate_conditions(rule).await?
            {
                actions.extend(rule.actions.clone());
            }
        }

        Ok(actions)
    }

    async fn evaluate_conditions(
        &self,
        rule: &AutomationRule,
    ) -> Result<bool> {
        for condition in &rule.conditions {
            if !self.evaluate_condition(condition).await? {
                return Ok(false);
            }
        }
        Ok(true)
    }
}
```

## Scheduling

### 1. Time-Based Triggers

```typescript
interface Schedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly'
  time: string
  days?: number[]
  date?: string
  timezone: string
}

class ScheduleManager {
  private schedules: Map<string, Schedule>
  private jobs: Map<string, Job>

  addSchedule(ruleId: string, schedule: Schedule): void {
    const job = new CronJob(
      this.createCronExpression(schedule),
      () => this.executeRule(ruleId),
      null,
      true,
      schedule.timezone
    )

    this.schedules.set(ruleId, schedule)
    this.jobs.set(ruleId, job)
  }

  private createCronExpression(schedule: Schedule): string {
    switch (schedule.type) {
      case 'daily':
        return `0 ${schedule.time} * * *`
      case 'weekly':
        return `0 ${schedule.time} * * ${schedule.days!.join(',')}`
      case 'monthly':
        return `0 ${schedule.time} ${schedule.date} * *`
      default:
        throw new Error('Invalid schedule type')
    }
  }
}
```

### 2. Event Scheduling

```rust
pub struct EventScheduler {
    queue: PriorityQueue<ScheduledEvent>,
    timer: Timer,
}

impl EventScheduler {
    pub fn schedule_event(
        &mut self,
        event: Event,
        delay: Duration,
    ) -> Result<()> {
        let scheduled = ScheduledEvent {
            event,
            execution_time: Instant::now() + delay,
        };

        self.queue.push(scheduled);
        self.update_timer()?;
        Ok(())
    }

    fn update_timer(&mut self) -> Result<()> {
        if let Some(next) = self.queue.peek() {
            self.timer.reset(next.execution_time);
        }
        Ok(())
    }
}
```

## Scene Management

### 1. Scene Definition

```typescript
interface Scene {
  id: string
  name: string
  devices: DeviceState[]
  transition?: {
    duration: number
    curve: 'linear' | 'easeIn' | 'easeOut'
  }
}

interface DeviceState {
  deviceId: string
  state: Record<string, any>
}

class SceneManager {
  private scenes: Map<string, Scene>

  async activateScene(sceneId: string): Promise<void> {
    const scene = this.scenes.get(sceneId)
    if (!scene) {
      throw new Error('Scene not found')
    }

    const transitions = scene.devices.map(async device => {
      return this.transitionDevice(device.deviceId, device.state, scene.transition)
    })

    await Promise.all(transitions)
  }

  private async transitionDevice(
    deviceId: string,
    targetState: Record<string, any>,
    transition?: SceneTransition
  ): Promise<void> {
    if (!transition) {
      await this.deviceService.setState(deviceId, targetState)
      return
    }

    const currentState = await this.deviceService.getState(deviceId)
    const steps = this.calculateTransitionSteps(currentState, targetState, transition)

    for (const step of steps) {
      await this.deviceService.setState(deviceId, step)
      await delay(transition.duration / steps.length)
    }
  }
}
```

### 2. Scene Execution

```rust
pub struct SceneExecutor {
    device_manager: Arc<DeviceManager>,
    transition_manager: Arc<TransitionManager>,
}

impl SceneExecutor {
    pub async fn execute_scene(
        &self,
        scene: &Scene,
    ) -> Result<()> {
        let mut tasks = Vec::new();

        for device in &scene.devices {
            let task = self.transition_device(
                device.clone(),
                scene.transition.clone(),
            );
            tasks.push(task);
        }

        try_join_all(tasks).await?;
        Ok(())
    }

    async fn transition_device(
        &self,
        device: DeviceState,
        transition: Option<Transition>,
    ) -> Result<()> {
        match transition {
            Some(t) => {
                self.transition_manager
                    .start_transition(device, t)
                    .await
            }
            None => {
                self.device_manager
                    .set_state(device.id, device.state)
                    .await
            }
        }
    }
}
```

## Conditions

### 1. State Conditions

```typescript
interface StateCondition {
  type: 'state'
  device: string
  property: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte'
  value: any
}

class ConditionEvaluator {
  async evaluateState(condition: StateCondition): Promise<boolean> {
    const state = await this.deviceService.getState(condition.device)
    const value = state[condition.property]

    switch (condition.operator) {
      case 'eq':
        return value === condition.value
      case 'gt':
        return value > condition.value
      case 'lt':
        return value < condition.value
      // ... other operators
    }
  }
}
```

### 2. Time Conditions

```typescript
interface TimeCondition {
  type: 'time'
  operator: 'at' | 'before' | 'after' | 'between'
  time: string | [string, string]
  days?: number[]
}

class TimeConditionEvaluator {
  evaluateTime(condition: TimeCondition): boolean {
    const now = new Date()
    const currentTime = format(now, 'HH:mm')
    const currentDay = now.getDay()

    if (condition.days && !condition.days.includes(currentDay)) {
      return false
    }

    switch (condition.operator) {
      case 'at':
        return currentTime === condition.time
      case 'between':
        const [start, end] = condition.time as [string, string]
        return isWithinInterval(now, { start, end })
      // ... other operators
    }
  }
}
```

## Testing

### 1. Rule Testing

```typescript
describe('Rule Engine', () => {
  let engine: RuleEngine

  beforeEach(() => {
    engine = new RuleEngine()
  })

  it('executes matching rules', async () => {
    const rule: AutomationRule = {
      id: '1',
      name: 'Test Rule',
      enabled: true,
      trigger: {
        type: 'device',
        source: 'sensor-1',
        event: 'motion_detected',
      },
      conditions: [
        {
          type: 'state',
          device: 'light-1',
          property: 'power',
          operator: 'eq',
          value: 'off',
        },
      ],
      actions: [
        {
          type: 'device',
          target: 'light-1',
          command: 'turn_on',
        },
      ],
    }

    engine.addRule(rule)

    const event = {
      type: 'device',
      source: 'sensor-1',
      event: 'motion_detected',
    }

    const actions = await engine.processEvent(event)
    expect(actions).toHaveLength(1)
    expect(actions[0]).toMatchObject({
      target: 'light-1',
      command: 'turn_on',
    })
  })
})
```

### 2. Scene Testing

```typescript
describe('Scene Manager', () => {
  let manager: SceneManager

  beforeEach(() => {
    manager = new SceneManager()
  })

  it('executes scene transitions', async () => {
    const scene: Scene = {
      id: '1',
      name: 'Movie Mode',
      devices: [
        {
          deviceId: 'light-1',
          state: { brightness: 20 },
        },
        {
          deviceId: 'tv-1',
          state: { power: 'on', input: 'hdmi1' },
        },
      ],
      transition: {
        duration: 1000,
        curve: 'easeOut',
      },
    }

    manager.addScene(scene)
    await manager.activateScene(scene.id)

    const light = await deviceService.getState('light-1')
    expect(light.brightness).toBe(20)

    const tv = await deviceService.getState('tv-1')
    expect(tv).toMatchObject({
      power: 'on',
      input: 'hdmi1',
    })
  })
})
```
