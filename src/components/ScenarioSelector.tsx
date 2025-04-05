
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ScenarioSelectorProps {
  selectedScenario: string;
  onSelectScenario: (scenario: string) => void;
}

const scenarios = [
  'Setting Boundaries',
  'Delivering Criticism',
  'Resolving Conflict',
  'Apologizing',
  'Rejecting an Offer',
  'Expressing Gratitude',
  'Breaking Up',
  'Requesting Help',
  'Negotiating',
  'Reconnecting',
];

const ScenarioSelector = ({ selectedScenario, onSelectScenario }: ScenarioSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="scenario">Scenario Type</Label>
      <Select value={selectedScenario} onValueChange={onSelectScenario}>
        <SelectTrigger id="scenario" className="bg-white border-glycos-200">
          <SelectValue placeholder="Select scenario" />
        </SelectTrigger>
        <SelectContent>
          {scenarios.map(scenario => (
            <SelectItem key={scenario} value={scenario}>{scenario}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScenarioSelector;
