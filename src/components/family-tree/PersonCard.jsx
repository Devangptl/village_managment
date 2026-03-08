import React from 'react';

// Generation-based style configs
const GENERATION_STYLES = {
  0: {
    cardWidth: 'w-48',
    avatarSize: 'w-16 h-16',
    avatarText: 'text-xl',
    nameSize: 'text-sm',
    label: 'Elder',
    labelIcon: '👑',
    accentFrom: 'from-amber-400',
    accentTo: 'to-orange-500',
    borderColor: 'border-amber-300',
    selectedBorder: 'border-amber-500',
    selectedBg: 'bg-amber-50',
    selectedRing: 'ring-4 ring-amber-200 shadow-amber-100',
    relatedBorder: 'border-amber-200',
    relatedBg: 'bg-amber-50/50',
    relatedRing: 'ring-2 ring-amber-100',
    badgeBg: 'bg-gradient-to-r from-amber-100 to-orange-100',
    badgeText: 'text-amber-700',
    glowColor: 'shadow-amber-100/50',
  },
  1: {
    cardWidth: 'w-42',
    avatarSize: 'w-14 h-14',
    avatarText: 'text-lg',
    nameSize: 'text-sm',
    label: 'Parent',
    labelIcon: '🏡',
    accentFrom: 'from-emerald-400',
    accentTo: 'to-teal-500',
    borderColor: 'border-emerald-200',
    selectedBorder: 'border-emerald-500',
    selectedBg: 'bg-emerald-50',
    selectedRing: 'ring-4 ring-emerald-200 shadow-emerald-100',
    relatedBorder: 'border-teal-300',
    relatedBg: 'bg-teal-50',
    relatedRing: 'ring-2 ring-teal-100',
    badgeBg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
    badgeText: 'text-emerald-700',
    glowColor: 'shadow-emerald-100/50',
  },
  2: {
    cardWidth: 'w-36',
    avatarSize: 'w-12 h-12',
    avatarText: 'text-base',
    nameSize: 'text-xs',
    label: 'Youth',
    labelIcon: '🌱',
    accentFrom: 'from-blue-400',
    accentTo: 'to-violet-500',
    borderColor: 'border-blue-200',
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    selectedRing: 'ring-4 ring-blue-200 shadow-blue-100',
    relatedBorder: 'border-blue-300',
    relatedBg: 'bg-blue-50/50',
    relatedRing: 'ring-2 ring-blue-100',
    badgeBg: 'bg-gradient-to-r from-blue-100 to-violet-100',
    badgeText: 'text-blue-700',
    glowColor: 'shadow-blue-100/50',
  },
};

function getGenerationStyle(gen) {
  if (gen <= 0) return GENERATION_STYLES[0];
  if (gen === 1) return GENERATION_STYLES[1];
  return GENERATION_STYLES[2];
}

function calculateAge(birthDate, deathDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export default function PersonCard({ person, isSelected, isRelated, onClick, generation = 0 }) {
  if (!person) return null;

  const initials = (person.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const isMale = person.gender === 'male';
  const isFemale = person.gender === 'female';
  const isDeceased = !!person.death_date;
  const style = getGenerationStyle(generation);

  // Avatar background by gender
  const avatarBg = isFemale
    ? 'bg-gradient-to-br from-pink-400 to-rose-500'
    : isMale
    ? `bg-gradient-to-br ${style.accentFrom} ${style.accentTo}`
    : 'bg-gradient-to-br from-purple-400 to-violet-500';

  // Card border/bg based on selection state
  let borderClass = style.borderColor;
  let bgClass = 'bg-white';
  let ringClass = '';

  if (isSelected) {
    borderClass = style.selectedBorder;
    bgClass = style.selectedBg;
    ringClass = style.selectedRing;
  } else if (isRelated) {
    borderClass = style.relatedBorder;
    bgClass = style.relatedBg;
    ringClass = style.relatedRing;
  }

  const birthYear = person.birth_year || (person.birth_date ? new Date(person.birth_date).getFullYear() : null);
  const deathYear = person.death_date ? new Date(person.death_date).getFullYear() : null;
  const age = calculateAge(person.birth_date, person.death_date);

  return (
    <div
      className={`${style.cardWidth} flex flex-col items-center rounded-xl p-3 border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shrink-0 ${borderClass} ${bgClass} ${ringClass} shadow-sm ${style.glowColor} relative`}
      onClick={(e) => { e.stopPropagation(); onClick(person.id); }}
      style={{ opacity: isDeceased ? 0.85 : 1 }}
    >
      {/* Generation Badge */}
      <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${style.badgeBg} ${style.badgeText} border border-white shadow-sm whitespace-nowrap`}>
        {style.labelIcon} {style.label}
      </span>

      {/* Deceased Indicator */}
      {isDeceased && (
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xs" title="Deceased">
          🕊️
        </span>
      )}

      {/* Avatar */}
      <div className={`${style.avatarSize} rounded-full overflow-hidden mt-2 mb-2 flex items-center justify-center shrink-0 shadow-inner border-2 border-white ${person.photo ? '' : avatarBg} ${isDeceased ? 'grayscale-[30%]' : ''}`}>
        {person.photo ? (
          <img src={person.photo} alt={person.name} className={`w-full h-full object-cover ${isDeceased ? 'grayscale-[30%]' : ''}`} />
        ) : (
          <span className={`text-white font-bold ${style.avatarText}`}>{initials}</span>
        )}
      </div>

      {/* Name */}
      <h3 className={`font-semibold text-gray-800 ${style.nameSize} leading-tight text-center truncate w-full px-1`} title={person.name}>
        {person.name}
      </h3>

      {/* Age / Birth-Death Years */}
      {(birthYear || age !== null) && (
        <p className="text-[11px] text-gray-500 mt-0.5">
          {age !== null && <span className="font-semibold">{age} yrs</span>}
          {age !== null && birthYear && ' · '}
          {birthYear && (
            <span>{birthYear}{deathYear ? ' – ' + deathYear : ''}</span>
          )}
        </p>
      )}

      {/* Death years only (when no birth data) */}
      {!birthYear && age === null && deathYear && (
        <p className="text-[11px] text-gray-400 mt-0.5 italic">
          † {deathYear}
        </p>
      )}

      {/* Family Name */}
      {person.family_name && (
        <span className="mt-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-gray-500 font-medium uppercase tracking-wide">
          {person.family_name}
        </span>
      )}

      {/* Occupation */}
      {person.occupation && (
        <p className="text-[10px] text-gray-400 mt-1 italic truncate w-full text-center px-1">
          {person.occupation}
        </p>
      )}

      {/* Gender icon */}
      <div className="absolute bottom-1 right-1.5">
        <span className="text-[10px]">{isMale ? '♂' : isFemale ? '♀' : ''}</span>
      </div>
    </div>
  );
}
