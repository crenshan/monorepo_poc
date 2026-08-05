import { Card } from '@mono/ui';

import './TestView.css';

export function TestView() {
  return (
    <div className="test-view">
      <Card>
        <h2>TESTING</h2>
        <div className="demo-row">
          <button className="test-button">This is a button</button>
        </div>
        <div className="demo-row">
          <input className="test-input" value="Test Input" />
        </div>
      </Card>
    </div>
  );
}
