'use client';

import Image from 'next/image';
import { Restaurant } from '@/types';

interface Props {
  restaurant: Restaurant;
  cartCount: number;
  onCartClick: () => void;
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* Six floating ember sparks — purely decorative, CSS-driven */
const EMBERS = [
  { left: '12%',  top: '72%', size: 3,   delay: '0s',    dur: '3.2s' },
  { left: '28%',  top: '80%', size: 2.5, delay: '0.7s',  dur: '2.8s' },
  { left: '48%',  top: '68%', size: 4,   delay: '1.2s',  dur: '3.6s' },
  { left: '65%',  top: '76%', size: 2,   delay: '0.3s',  dur: '3.0s' },
  { left: '78%',  top: '82%', size: 3.5, delay: '1.6s',  dur: '2.6s' },
  { left: '88%',  top: '70%', size: 2,   delay: '0.9s',  dur: '3.4s' },
];

export default function Header({ restaurant, cartCount, onCartClick }: Props) {
  return (
    <header style={{ position: 'relative', width: '100%', background: '#060402' }}>

      {/* ── Artwork hero ──────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 290,
        overflow: 'hidden',
        animation: 'headerReveal 0.9s cubic-bezier(.2,.8,.2,1) both',
      }}>
        {/* Background artwork image */}
        <Image
          src="/header-image.png"
          alt={restaurant.name}
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
          sizes="100vw"
        />

        {/* Dark cinematic vignette — radial */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0,0,0,0) 20%, rgba(6,4,2,0.72) 100%)',
          animation: 'vignetteBreath 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Left edge safe-margin gradient */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
          background: 'linear-gradient(to right, rgba(6,4,2,0.55) 0%, transparent 18%, transparent 82%, rgba(6,4,2,0.55) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom gradient — blends seamlessly into page background */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 120,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(6,4,2,0.70) 55%, #060402 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── Floating ember sparks ─────────────────────────── */}
        {EMBERS.map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: e.left, top: e.top,
              width: e.size, height: e.size,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#FF6A00' : '#FFB347',
              boxShadow: `0 0 ${e.size * 2}px ${e.size}px rgba(255,106,0,0.6)`,
              animation: `emberFloat ${e.dur} ease-out ${e.delay} infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Smoke wisps at base of header */}
        {[0, 1, 2].map((i) => (
          <div
            key={`smoke-${i}`}
            style={{
              position: 'absolute',
              bottom: 30,
              left: `${25 + i * 22}%`,
              width: 40 + i * 10,
              height: 40 + i * 10,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,160,100,0.08) 0%, transparent 70%)',
              animation: `smokeRise ${2.4 + i * 0.6}s ease-out ${i * 0.8}s infinite`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ── Top buttons row ──────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 20, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 20px',
          maxWidth: 440, margin: '0 auto',
        }}>
          {/* Google Maps button — right side (RTL start) */}
          {restaurant.google_maps_url ? (
            <a
              href={restaurant.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 44, height: 44, borderRadius: 999,
                background: 'rgba(12,9,6,0.72)',
                border: '1px solid rgba(255,106,0,0.28)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#F0DDB8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                textDecoration: 'none',
              }}
              aria-label="الموقع على الخريطة"
            >
              <MapPinIcon />
            </a>
          ) : (
            <div style={{ width: 44 }} />
          )}

          {/* Cart button — left side */}
          <button
            onClick={onCartClick}
            style={{
              width: 44, height: 44, borderRadius: 999,
              background: 'rgba(12,9,6,0.72)',
              border: '1px solid rgba(255,106,0,0.28)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#F0DDB8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              position: 'relative',
              transition: 'border-color 200ms, box-shadow 200ms',
            }}
            aria-label="السلة"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, left: -5,
                minWidth: 20, height: 20, borderRadius: 999,
                background: 'linear-gradient(135deg, #FF6A00 0%, #CC4A00 100%)',
                color: '#F0DDB8',
                fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid #060402',
                lineHeight: 1,
                boxShadow: '0 2px 8px rgba(255,106,0,.45)',
              }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Restaurant name — bottom of hero ──────────────── */}
        <div style={{
          position: 'absolute', bottom: 22, left: 0, right: 0,
          textAlign: 'center',
          padding: '0 40px',
          animation: 'nameReveal 0.8s cubic-bezier(.2,.8,.2,1) 0.3s both',
        }}>
          <div style={{
            fontFamily: 'var(--font-rubik), Rubik, sans-serif',
            fontWeight: 800, fontSize: 24, color: '#F0DDB8',
            lineHeight: 1.15,
            textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 0 28px rgba(255,106,0,0.2)',
            letterSpacing: '0.01em',
          }}>
            {restaurant.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", Georgia, serif',
            fontWeight: 900, fontSize: 9.5, letterSpacing: '.14em',
            color: '#FF8C2A', textTransform: 'uppercase', marginTop: 5,
            textShadow: '0 1px 8px rgba(255,106,0,0.4)',
            opacity: 0.9,
          }}>
            VIKING BURGER · EST. 2020
          </div>
        </div>
      </div>

      {/* Ember line divider under header */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(255,106,0,0.3) 30%, rgba(255,140,42,0.5) 50%, rgba(255,106,0,0.3) 70%, transparent)',
      }} />
    </header>
  );
}
