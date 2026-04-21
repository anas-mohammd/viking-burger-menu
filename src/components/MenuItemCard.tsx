'use client';

import { MenuItem, CartItem, Offer } from '@/types';
import { formatPrice } from '@/lib/currencies';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

interface Props {
  item: MenuItem;
  currencyCode: string;
  cart: CartItem[];
  offers: Offer[];
  compact?: boolean;
  onAdd: (item: MenuItem, variantName?: string, variantPrice?: string) => void;
  onRemove: (itemId: string, variantName?: string) => void;
  onOpenDetail: (item: MenuItem) => void;
}

/* Dark ember-toned placeholder gradients */
const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #1A0800 0%, #4A1A00 100%)',
  'linear-gradient(135deg, #200A00 0%, #FF6A00 100%)',
  'linear-gradient(135deg, #1A0800 0%, #8B2F00 100%)',
  'linear-gradient(135deg, #0D0A06 0%, #CC4A00 100%)',
  'linear-gradient(135deg, #2A1200 0%, #FF8C2A 100%)',
  'linear-gradient(135deg, #1A0800 0%, #C0392B 100%)',
];

function thumbGradient(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return THUMB_GRADIENTS[Math.abs(hash) % THUMB_GRADIENTS.length];
}

function shortLabel(name: string): string {
  return name.split(/\s+/)[0] ?? name;
}

export default function MenuItemCard({
  item, currencyCode, cart, offers, compact = false, onAdd, onRemove, onOpenDetail,
}: Props) {
  const hasVariants = item.variants && item.variants.length > 0;

  const totalQty = cart
    .filter((ci) => ci.item.id === item.id)
    .reduce((s, ci) => s + ci.quantity, 0);

  const applicableOffers = offers.filter(
    (o) => o.applicable_items.length === 0 || o.applicable_items.includes(item.id)
  );

  const displayPrice = hasVariants
    ? Math.min(...item.variants.map((v) => parseFloat(v.price))).toString()
    : item.price;

  const basePrice = parseFloat(displayPrice);
  const discountedPrice = applicableOffers.reduce((price, offer) => {
    const val = parseFloat(offer.discount_value);
    return offer.discount_type === 'percentage'
      ? price * (1 - val / 100)
      : Math.max(0, price - val);
  }, basePrice);
  const hasDiscount = applicableOffers.length > 0 && discountedPrice < basePrice;

  const handleAddClick = () => {
    if (hasVariants) onOpenDetail(item);
    else onAdd(item);
  };
  const handleRemoveClick = () => {
    if (hasVariants) onOpenDetail(item);
    else onRemove(item.id);
  };

  const formatOfferLabel = (offer: Offer) => {
    const val = parseFloat(offer.discount_value);
    return offer.discount_type === 'percentage'
      ? `خصم ${Number.isInteger(val) ? val : val}%`
      : `خصم ${val}`;
  };

  /* ── Thumbnail ─────────────────────────────────────── */
  const Thumb = ({ size }: { size: 'card' | 'grid' }) => (
    <div style={{
      marginTop: 10, marginBottom: 10, marginRight: 10,
      width: size === 'grid' ? '100%' : 90,
      minWidth: size === 'card' ? 90 : undefined,
      alignSelf: size === 'card' ? 'stretch' : undefined,
      height: size === 'grid' ? '100%' : undefined,
      borderRadius: size === 'grid' ? '16px 16px 0 0' : 12,
      overflow: 'hidden', flexShrink: 0, position: 'relative',
    }}>
      {item.image_url ? (
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes={size === 'card' ? '90px' : '50vw'}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: thumbGradient(item.name),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#F0DDB8', fontSize: size === 'grid' ? 20 : 12,
          fontWeight: 700, letterSpacing: '-0.01em',
          textShadow: '0 1px 6px rgba(0,0,0,.6)',
        }}>
          {shortLabel(item.name)}
        </div>
      )}
      {/* Offer badge */}
      {applicableOffers.length > 0 && (
        <div style={{ position: 'absolute', top: 6, right: 6 }}>
          <span style={{
            background: 'linear-gradient(135deg, #C0392B, #8B1A0E)',
            color: '#F0DDB8',
            fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999,
            boxShadow: '0 2px 8px rgba(192,57,43,.5)',
          }}>
            {formatOfferLabel(applicableOffers[0])}
          </span>
        </div>
      )}
    </div>
  );

  /* ── Grid card ─────────────────────────────────────── */
  if (compact) {
    return (
      <div
        className="item-card fade-in"
        onClick={() => onOpenDetail(item)}
        style={{
          background: '#1C1510',
          border: '1px solid rgba(255,106,0,0.10)',
          borderRadius: 18,
          boxShadow: '0 2px 14px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.5)',
          overflow: 'hidden', cursor: 'pointer',
          transition: 'transform 150ms cubic-bezier(.2,.8,.2,1), box-shadow 150ms',
        }}
        onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(.99)'; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
      >
        <div style={{ position: 'relative', width: '100%', height: 180 }}>
          <Thumb size="grid" />
          {totalQty > 0 && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              width: 24, height: 24, borderRadius: 999,
              background: 'linear-gradient(135deg, #FF6A00, #CC4A00)',
              color: '#F0DDB8',
              fontSize: 11, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255,106,0,.45)',
            }}>{totalQty}</div>
          )}
        </div>
        <div style={{ padding: '10px 12px 13px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#F0DDB8', lineHeight: 1.3, marginBottom: 7 }}>
            {item.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#FF8C2A', fontVariantNumeric: 'tabular-nums' }}>
              {hasVariants && <span style={{ fontSize: 11, color: '#8A7048', fontWeight: 500, marginLeft: 3 }}>من</span>}
              {hasDiscount
                ? <span style={{ color: '#E03232' }}>{formatPrice(discountedPrice, currencyCode)}</span>
                : formatPrice(displayPrice, currencyCode)
              }
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddClick(); }}
              style={{
                width: 32, height: 32, borderRadius: 999,
                background: 'linear-gradient(135deg, #FF6A00, #CC4A00)',
                color: '#F0DDB8',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(255,106,0,.35)',
                flexShrink: 0,
                transition: 'box-shadow 150ms',
              }}
              aria-label="أضف"
            >
              <Plus style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── List card ─────────────────────────────────────── */
  return (
    <div
      className="item-card fade-in"
      onClick={() => onOpenDetail(item)}
      style={{
        background: '#1C1510',
        border: '1px solid rgba(255,106,0,0.10)',
        borderRadius: 18,
        boxShadow: '0 2px 14px rgba(0,0,0,.45), 0 1px 3px rgba(0,0,0,.5)',
        padding: 0, display: 'flex', gap: 0,
        overflow: 'hidden',
        height: 110,
        cursor: 'pointer',
        transition: 'transform 150ms cubic-bezier(.2,.8,.2,1), box-shadow 150ms',
      }}
      onMouseDown={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(.99)'; }}
      onMouseUp={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; }}
    >
      <Thumb size="card" />

      <div style={{
        display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0,
        padding: '11px 14px 11px 12px',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        {/* Top: name + description */}
        <div>
          <div style={{
            fontWeight: 700, fontSize: 15, color: '#F0DDB8', lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.name}
          </div>
          {item.description && (
            <div style={{
              fontSize: 12, color: '#8A7048', lineHeight: 1.4, marginTop: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.description}
            </div>
          )}
        </div>

        {/* Price + action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#FF8C2A', fontVariantNumeric: 'tabular-nums' }}>
            {hasVariants && <span style={{ fontSize: 11, color: '#8A7048', fontWeight: 500, marginLeft: 4 }}>من</span>}
            {hasDiscount ? (
              <span style={{ color: '#E03232' }}>{formatPrice(discountedPrice, currencyCode)}</span>
            ) : (
              formatPrice(displayPrice, currencyCode)
            )}
          </div>

          {totalQty === 0 ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleAddClick(); }}
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: 'linear-gradient(135deg, #FF6A00, #CC4A00)',
                color: '#F0DDB8',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(255,106,0,.35)',
                flexShrink: 0,
                transition: 'box-shadow 150ms',
              }}
              aria-label="أضف"
            >
              <Plus style={{ width: 18, height: 18, strokeWidth: 2.5 }} />
            </button>
          ) : hasVariants ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpenDetail(item); }}
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: '#2A1F0F', border: '1px solid rgba(255,106,0,.25)',
                color: '#FF8C2A', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}
            >
              {totalQty}
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: '#2A1F0F', borderRadius: 999, padding: 3,
                border: '1px solid rgba(255,106,0,.20)', flexShrink: 0,
              }}
            >
              <button onClick={handleRemoveClick} style={qtyBtnStyle}>
                <Minus style={{ width: 14, height: 14 }} />
              </button>
              <div style={{ minWidth: 26, textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#F0DDB8' }}>
                {totalQty}
              </div>
              <button onClick={handleAddClick} style={qtyBtnStyle}>
                <Plus style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 999,
  background: 'rgba(255,106,0,0.15)', border: 'none', color: '#FF8C2A',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 150ms',
};
