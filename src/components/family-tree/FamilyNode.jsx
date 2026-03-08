import React from 'react';
import PersonCard from './PersonCard';

export default function FamilyNode({ node, onPersonClick, selectedId, relatedIds, generation = 0 }) {
  const hasSpouse = node.spouses && node.spouses.length > 0;

  const isSelected = (id) => id === selectedId;
  const isRelated = (id) => relatedIds.includes(id);

  // Collect unique children (deduplicate between parent and spouse)
  const childNodes = node.children || [];

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Couple / Single Node */}
      <div className="flex items-center relative">
        <PersonCard
          person={node}
          onClick={onPersonClick}
          isSelected={isSelected(node.id)}
          isRelated={isRelated(node.id)}
          generation={generation}
        />

        {hasSpouse && node.spouses.map(spouse => (
          <React.Fragment key={spouse.id}>
            {/* Horizontal connector between spouses */}
            <div className="w-8 h-[2px] bg-gradient-to-r from-pink-300 to-blue-300 self-center shrink-0"></div>
            <PersonCard
              person={spouse}
              onClick={onPersonClick}
              isSelected={isSelected(spouse.id)}
              isRelated={isRelated(spouse.id)}
              generation={generation}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Children branch */}
      {childNodes.length > 0 && (
        <div className="flex flex-col items-center">
          {/* Vertical line down from couple center */}
          <div className="w-[2px] h-8 bg-gray-300"></div>

          {/* Horizontal connector across all children */}
          {childNodes.length > 1 && (
            <div className="relative w-full flex justify-center">
              <div
                className="h-[2px] bg-gray-300"
                style={{
                  width: 'calc(100% - 10rem)',
                  minWidth: '2rem',
                }}
              ></div>
            </div>
          )}

          <div className="flex gap-2 items-start">
            {childNodes.map(child => (
              <div key={child.id} className="flex flex-col items-center">
                {/* Vertical line down to child card */}
                <div className="w-[2px] h-8 bg-gray-300"></div>
                <FamilyNode
                  node={child}
                  onPersonClick={onPersonClick}
                  selectedId={selectedId}
                  relatedIds={relatedIds}
                  generation={generation + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
