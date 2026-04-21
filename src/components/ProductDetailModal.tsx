'use client';

import { useState, useEffect } from 'react';
import { MenuItem, CartItem, ItemVariant } from '@/types';
import { formatPrice } from '@/lib/currencies';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

interface Props {
  item: MenuItem | null;
  open: boolean;
  currencyCode: string;
  cart: CartItem[];
  onClose: () => void;
  onAdd: (item: MenuItem, variantName?: string, variantPrice?: string) => void;
  onRemove: (itemId: string, variantName?: string) => void;
}

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

export default function ProductDetailModal({
  item, open, currencyCode, cart, onClose, onAdd, onRemove,
}: Props) {
  const hasVariants = !!item?.variants?.length;
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item && hasVariants) {
      setSelectedVariant(item.variants[1] ?? item.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQty(1);
  }, [item]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!item) return null;

  const cartKey = selectedVariant ? `${item.id}::${selectedVariant.name}` : item.id;
  const cartItem = cart.find((ci) =>
    (ci.variantName ? `${ci.item.id}::${ci.variantName}` : ci.item.id) === cartKey
  );
  const cartQty = cartItem?.quantity ?? 0;

  const unitPrice = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(item.price);
  const total = unitPrice * qty;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      onAdd(item, selectedVariant?.name, selectedVariant?.price);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`backdrop-in ${open ? '' : 'pointer-events-none'}`}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 280ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{
          background: '#100D08',
          border: '1px solid rgba(255,106,0,0.15)',
          borderBottom: 'none',
          maxWidth: 440, margin: '0 auto',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          maxHeight: '92vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 -20px 60px rgba(0,0,0,.7)',
        }}>
          {/* Handle */}
          <div style={{
            width: 40, height: 4,
            background: 'rgba(255,106,0,0.25)',
            borderRadius: 999, margin: '12px auto 4px',
          }} />

          {/* Scrollable body */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* Food image */}
            <div style={{
              margin: '8px 16px 0', borderRadius: 18,
              overflow: 'hidden', position: 'relative', height: 220,
              border: '1px solid rgba(255,106,0,0.12)',
            }}>
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="440px"
                  priority
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: thumbGradient(item.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F0DDB8', fontSize: 32, fontWeight: 700,
                  textShadow: '0 2px 12px rgba(0,0,0,.6)',
                }}>
                  {item.name.split(/\s+/)[0]}
                </div>
              )}
              {/* Subtle image overlay for depth */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                background: 'linear-gradient(to top, rgba(16,13,8,0.6), transparent)',
                pointerEvents: 'none',
              }} />
            </div>

            <div style={{ padding: '16px 20px 0' }}>
              {/* Name */}
              <div style={{
                fontWeight: 800, fontSize: 24, color: '#F0DDB8', lineHeight: 1.2,
                textShadow: '0 1px 6px rgba(0,0,0,.4)',
              }}>
                {item.name}
              </div>
              {/* Description */}
              {item.description && (
                <div style={{ fontSize: 14, color: '#8A7048', lineHeight: 1.55, marginTop: 6 }}>
                  {item.description}
                </div>
              )}

              {/* Variant picker */}
              {hasVariants && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#604830', marginBottom: 10, letterSpacing: '.05em' }}>
                    اختر الحجم
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {item.variants.map((v) => {
                      const sel = selectedVariant?.name === v.name;
                      return (
                        <div
                          key={v.name}
                          onClick={() => setSelectedVariant(v)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 14px', borderRadius: 14,
                            background: sel ? 'rgba(255,106,0,0.10)' : 'rgba(28,21,16,0.6)',
                            border: sel
                              ? '1px solid rgba(255,106,0,0.45)'
                              : '1px solid rgba(255,106,0,0.10)',
                            boxShadow: sel ? '0 0 0 1px rgba(255,106,0,0.20) inset' : 'none',
                            cursor: 'pointer',
                            transition: 'all 150ms',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                              border: sel ? '2px solid #FF6A00' : '2px solid rgba(255,106,0,0.25)',
                              background: sel
                                ? 'radial-gradient(circle, #FF6A00 0 38%, transparent 44%)'
                                : 'transparent',
                              boxShadow: sel ? '0 0 8px rgba(255,106,0,.4)' : 'none',
                            }} />
                            <span style={{ fontSize: 15, color: sel ? '#F0DDB8' : '#C4A46A' }}>{v.name}</span>
                          </div>
                          <div style={{
                            fontWeight: 700, color: sel ? '#FF8C2A' : '#8A7048',
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {formatPrice(v.price, currencyCode)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#604830', letterSpacing: '.05em' }}>الكمية</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginRight: 'auto',
                  background: '#1C1510',
                  border: '1px solid rgba(255,106,0,0.18)',
                  borderRadius: 999, padding: 4,
                }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={qtyBtn}>
                    <Minus style={{ width: 15, height: 15 }} />
                  </button>
                  <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: 16, color: '#F0DDB8' }}>
                    {qty}
                  </div>
                  <button onClick={() => setQty((q) => q + 1)} style={qtyBtn}>
                    <Plus style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA footer */}
          <div style={{
            padding: '12px 20px 24px',
            borderTop: '1px solid rgba(255,106,0,0.10)',
            background: '#100D08',
          }}>
            {cartQty > 0 ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  background: '#1C1510',
                  border: '1px solid rgba(255,106,0,.20)',
                  borderRadius: 999, padding: 4, flex: 1,
                  justifyContent: 'center',
                }}>
                  <button onClick={() => { onRemove(item.id, selectedVariant?.name); }} style={qtyBtn}>
                    <Minus style={{ width: 15, height: 15 }} />
                  </button>
                  <div style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: 17, color: '#F0DDB8' }}>
                    {cartQty}
                  </div>
                  <button onClick={() => { onAdd(item, selectedVariant?.name, selectedVariant?.price); }} style={qtyBtn}>
                    <Plus style={{ width: 15, height: 15 }} />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1, minHeight: 52, borderRadius: 999,
                    background: 'linear-gradient(135deg, #FF6A00, #CC4A00)',
                    color: '#F0DDB8',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: 16,
                    boxShadow: '0 4px 16px rgba(255,106,0,.30)',
                    textShadow: '0 1px 4px rgba(0,0,0,.3)',
                  }}
                >
                  تم
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                style={{
                  width: '100%', minHeight: 52, borderRadius: 999,
                  background: 'linear-gradient(135deg, #FF6A00 0%, #CC4A00 100%)',
                  color: '#F0DDB8',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 22px',
                  boxShadow: '0 4px 20px rgba(255,106,0,.35)',
                  textShadow: '0 1px 4px rgba(0,0,0,.3)',
                }}
              >
                <span>أضف إلى السلة</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(total, currencyCode)}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const qtyBtn: React.CSSProperties = {
  width: 30, height: 30, borderRadius: 999,
  background: 'rgba(255,106,0,0.15)', border: 'none', color: '#FF8C2A',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};
