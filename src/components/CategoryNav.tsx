'use client';

import { Category } from '@/types';
import { useEffect, useRef } from 'react';

interface Props {
  categories: Category[];
  activeId: string | null;
  viewMode: 'list' | 'grid';
  onSelect: (id: string) => void;
  onViewChange: (mode: 'list' | 'grid') => void;
}

export default function CategoryNav({ categories, activeId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !activeId) return;
    const btn = ref.current.querySelector(`[data-cat="${activeId}"]`) as HTMLElement;
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [activeId]);

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 30,
      padding: '10px 0 12px',
      background: 'rgba(6,4,2,0.92)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,106,0,0.12)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      <div
        ref={ref}
        className="no-scrollbar"
        style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          padding: '0 16px', scrollSnapType: 'x mandatory',
          maxWidth: 440, margin: '0 auto',
        }}
      >
        {categories.map((cat) => {
          const active = activeId === cat.id;
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0,
                display: 'inline-flex', alignItems: 'center',
                padding: '10px 18px', borderRadius: 999,
                background: active
                  ? 'linear-gradient(135deg, #FF6A00 0%, #CC4A00 100%)'
                  : 'rgba(28,21,16,0.85)',
                color: active ? '#F0DDB8' : '#C4A46A',
                border: active
                  ? '1px solid rgba(255,140,42,0.5)'
                  : '1px solid rgba(255,106,0,0.12)',
                fontFamily: 'inherit', fontSize: 14, fontWeight: active ? 700 : 500,
                minHeight: 40, cursor: 'pointer',
                scrollSnapAlign: 'start',
                transition: 'all 180ms cubic-bezier(.2,.8,.2,1)',
                boxShadow: active
                  ? '0 4px 16px rgba(255,106,0,.30), 0 1px 4px rgba(0,0,0,.4)'
                  : '0 1px 3px rgba(0,0,0,.3)',
                textShadow: active ? '0 1px 4px rgba(0,0,0,.3)' : 'none',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
