import React from 'react';
import FamilyNode from './FamilyNode';

export default function FamilyTree({ data, onPersonClick, selectedPersonId }) {
  if (!data || !data.tree || data.tree.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🌳</div>
          <p>No family tree data available to display.</p>
        </div>
      </div>
    );
  }

  // Pre-calculate related IDs for highlighting
  let relatedIds = [];
  if (selectedPersonId && data.connections) {
    const { parents = {}, children = {}, spouses = {} } = data.connections;
    const p = parents[selectedPersonId] || [];
    const c = children[selectedPersonId] || [];
    const s = spouses[selectedPersonId] || [];
    relatedIds = [...p, ...c, ...s];
  }

  return (
    <div className="w-full h-full overflow-auto p-8 flex flex-col items-center family-tree-scroll">
      {/* Generation Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Generations:</span>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <span className="text-sm">👑</span>
          <span className="text-xs font-semibold text-amber-700">Elders</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
          <span className="text-sm">🏡</span>
          <span className="text-xs font-semibold text-emerald-700">Parents</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200">
          <span className="text-sm">🌱</span>
          <span className="text-xs font-semibold text-blue-700">Youth</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
          <span className="text-xs">🕊️</span>
          <span className="text-[11px] text-gray-500">Deceased</span>
        </div>
      </div>

      {/* Tree */}
      <div className="inline-flex flex-col items-center">
        {data.tree.map((rootNode, index) => (
          <div
            key={rootNode.id}
            className={index > 0 ? 'mt-16 pt-8 border-t-2 border-dashed border-gray-200 w-full flex justify-center' : ''}
          >
            <FamilyNode
              node={rootNode}
              onPersonClick={onPersonClick}
              selectedId={selectedPersonId}
              relatedIds={relatedIds}
              generation={0}
            />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: [
        '.family-tree-scroll::-webkit-scrollbar { width: 8px; height: 8px; }',
        '.family-tree-scroll::-webkit-scrollbar-track { background: transparent; }',
        '.family-tree-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }',
        '.family-tree-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }',
      ].join('\n')}} />
    </div>
  );
}
