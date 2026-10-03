'use client';

import { useState } from 'react';
import { X, Plus, Home, Briefcase, MapPinned, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import type { AddressDTO } from '@cleancare/types';

interface Props {
  addresses: AddressDTO[];
  selected: AddressDTO | null;
  onSelect: (addr: AddressDTO) => void;
  onAddNew: () => void;
  onClose: () => void;
}

const TYPE_ICONS = {
  HOME:   { Icon: Home,      color: 'text-blue-600',  bg: 'bg-blue-50' },
  OFFICE: { Icon: Briefcase, color: 'text-orange-600',bg: 'bg-orange-50' },
  OTHER:  { Icon: MapPinned, color: 'text-purple-600',bg: 'bg-purple-50' },
};

export default function AddressModal({ addresses, selected, onSelect, onAddNew, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-navy-100">
          <h3 className="font-bold text-navy-900">Select Address</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-inputBg">
            <X className="w-4 h-4 text-navy-600" />
          </button>
        </div>

        {/* Address list */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPinned className="w-10 h-10 text-navy-200 mx-auto mb-2" />
              <p className="text-sm text-navy-500">No saved addresses</p>
            </div>
          ) : (
            addresses.map((addr) => {
              const { Icon, color, bg } = TYPE_ICONS[addr.type] ?? TYPE_ICONS.OTHER;
              const isSelected = selected?.id === addr.id;

              return (
                <button
                  key={addr.id}
                  onClick={() => onSelect(addr)}
                  className={clsx(
                    'w-full text-left p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-navy-100 bg-white'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
                      <Icon className={clsx('w-4 h-4', color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-navy-900">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="chip chip-info text-[10px]">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-navy-500 mt-0.5 leading-relaxed">
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`},
                        {' '}{addr.city}, {addr.pincode}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Add new address */}
        <div className="p-4 border-t border-navy-100">
          <button
            onClick={onAddNew}
            className="btn btn-outline btn-full btn-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}
