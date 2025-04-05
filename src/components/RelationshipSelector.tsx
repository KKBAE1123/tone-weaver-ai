
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RelationshipSelectorProps {
  selectedRelationship: string;
  onSelectRelationship: (relationship: string) => void;
}

const relationships = [
  'Romantic Partner',
  'Friend',
  'Family Member',
  'Colleague',
  'Manager',
  'Acquaintance',
  'Ex-Partner',
  'Roommate',
  'Neighbor',
  'Client/Customer',
];

const RelationshipSelector = ({ selectedRelationship, onSelectRelationship }: RelationshipSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="relationship">Relationship Context</Label>
      <Select value={selectedRelationship} onValueChange={onSelectRelationship}>
        <SelectTrigger id="relationship" className="bg-white border-glycos-200">
          <SelectValue placeholder="Select relationship" />
        </SelectTrigger>
        <SelectContent>
          {relationships.map(relationship => (
            <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RelationshipSelector;
