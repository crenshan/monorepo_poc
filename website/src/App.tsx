import { type ChangeEvent, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Modal,
  Select,
  Spinner,
  useToast,
} from '@mono/ui';
import type { IconName } from '@mono/ui';
import { add, isValidNumber } from '@mono/utils';
import { LoginView } from './views/LoginView';
import { ReportsView } from './views/ReportsView';
import { TeamSettingsView } from './views/TeamSettingsView';

import '@mono/ui/tokens.css';
import './App.css';

const iconNames: IconName[] = ['check', 'x', 'chevronDown', 'alertCircle', 'spinner'];

function App() {
  const { toast } = useToast();

  const [view, setView] = useState<'demo' | 'login' | 'team-settings' | 'reports'>('demo');
  const [nums, setNums] = useState({ a: '', b: '' });
  const [country, setCountry] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sum, setSum] = useState<number | null>(null);

  if (view === 'login') {
    return (
      <div className="demo">
        <div className="demo-row">
          <Button onClick={() => setView('demo')}>Back to component demo</Button>
        </div>
        <LoginView />
      </div>
    );
  }

  if (view === 'team-settings') {
    return (
      <div className="demo">
        <div className="demo-row">
          <Button onClick={() => setView('demo')}>Back to component demo</Button>
        </div>
        <TeamSettingsView />
      </div>
    );
  }

  if (view === 'reports') {
    return (
      <div className="demo">
        <div className="demo-row">
          <Button onClick={() => setView('demo')}>Back to component demo</Button>
        </div>
        <ReportsView />
      </div>
    );
  }

  const handleNumChange = (key: keyof typeof nums) => (e: ChangeEvent<HTMLInputElement>) => {
    setNums((prevNums) => ({
      ...prevNums,
      [key]: e.target.value,
    }));
  };

  const aValid = isValidNumber(nums.a);
  const bValid = isValidNumber(nums.b);

  return (
    <div className="demo">
      <h1>UI component demo</h1>

      <div className="demo-row">
        <Button onClick={() => setView('login')}>View login form</Button>
        <Button onClick={() => setView('team-settings')}>View team settings</Button>
        <Button onClick={() => setView('reports')}>View reports</Button>
      </div>

      <section className="demo-section">
        <h2>Button &amp; Input</h2>
        <div className="demo-row">
          <Input
            label="Number 1"
            type="text"
            placeholder="e.g. 12"
            value={nums.a}
            onChange={handleNumChange('a')}
            error={nums.a && !aValid ? 'Enter a valid number' : undefined}
          />
          <Input
            label="Number 2"
            type="text"
            placeholder="e.g. 30"
            value={nums.b}
            onChange={handleNumChange('b')}
            error={nums.b && !bValid ? 'Enter a valid number' : undefined}
          />
        </div>
        <div className="demo-row">
          <Button
            disabled={!aValid || !bValid}
            onClick={() => setSum(add(Number(nums.a), Number(nums.b)))}
          >
            Add
          </Button>
        </div>
        <Modal open={sum !== null} onClose={() => setSum(null)} title="Result">
          <p>
            {nums.a} + {nums.b} = {sum}
          </p>
          <Button onClick={() => setSum(null)}>Close</Button>
        </Modal>
      </section>

      <section className="demo-section">
        <h2>Input with an error</h2>
        <Input label="Email" placeholder="you@example.com" error="Enter a valid email address" />
      </section>

      <section className="demo-section">
        <h2>Select</h2>
        <Select
          label="Country"
          placeholder="Choose a country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
            { value: 'mx', label: 'Mexico', disabled: true },
          ]}
        />
      </section>

      <section className="demo-section">
        <h2>Badge</h2>
        <div className="demo-row">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      <section className="demo-section">
        <h2>Avatar</h2>
        <div className="demo-row demo-row--center">
          <Avatar name="Ada Lovelace" size="sm" />
          <Avatar name="Ada Lovelace" size="base" />
          <Avatar name="Ada Lovelace" size="lg" />
          <Avatar name="Ada Lovelace" size="xl" />
        </div>
      </section>

      <section className="demo-section">
        <h2>Icon</h2>
        <div className="demo-row demo-row--center">
          {iconNames.map((name) => (
            <div key={name} className="demo-icon">
              <Icon name={name} size="lg" title={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="demo-section">
        <h2>Spinner</h2>
        <div className="demo-row demo-row--center">
          <Spinner size="sm" />
          <Spinner size="base" />
          <Spinner size="lg" />
        </div>
      </section>

      <section className="demo-section">
        <h2>Card</h2>
        <Card>
          <h3>Card title</h3>
          <p>Cards are a simple bordered surface for grouping related content.</p>
        </Card>
      </section>

      <section className="demo-section">
        <h2>Alert</h2>
        <div className="demo-column">
          <Alert variant="neutral" title="Heads up">
            This is a neutral alert.
          </Alert>
          <Alert variant="success" title="Success">
            Your changes have been saved.
          </Alert>
          <Alert variant="warning" title="Warning">
            This action may have side effects.
          </Alert>
          <Alert variant="danger" title="Error" onDismiss={() => {}}>
            Something went wrong. Please try again.
          </Alert>
        </div>
      </section>

      <section className="demo-section">
        <h2>Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm action">
          <p>Are you sure you want to continue?</p>
          <div className="demo-row">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </section>

      <section className="demo-section">
        <h2>Toast</h2>
        <div className="demo-row">
          <Button onClick={() => toast({ description: 'Saved successfully', variant: 'success' })}>
            Show success toast
          </Button>
          <Button onClick={() => toast({ description: 'Something went wrong', variant: 'danger' })}>
            Show danger toast
          </Button>
        </div>
      </section>
    </div>
  );
}

export default App;
