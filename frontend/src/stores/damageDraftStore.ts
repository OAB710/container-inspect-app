import {create} from 'zustand';
import {DamageImage, DamageItem} from '../types/inspection';

interface DamageDraftState {
  damages: DamageItem[];
  setDamages: (items: DamageItem[]) => void;
  addDamage: (item: DamageItem) => void;
  updateDamage: (index: number, item: DamageItem) => void;
  removeDamage: (index: number) => void;
  addImageToDamage: (index: number, image: DamageImage) => void;
  removeImageFromDamage: (damageIndex: number, imageIndex: number) => void;
  resetDamages: () => void;
}

export const useDamageDraftStore = create<DamageDraftState>(set => ({
  damages: [],

  setDamages: items => set({damages: items}),

  addDamage: item =>
    set(state => ({
      damages: [...state.damages, item],
    })),

  updateDamage: (index, item) =>
    set(state => ({
      damages: state.damages.map((damage, i) => (i === index ? item : damage)),
    })),

  removeDamage: index =>
    set(state => ({
      damages: state.damages.filter((_, i) => i !== index),
    })),

  addImageToDamage: (index, image) =>
    set(state => ({
      damages: state.damages.map((damage, i) =>
        i === index
          ? {
              ...damage,
              images: [...(damage.images || []), image],
            }
          : damage,
      ),
    })),

  removeImageFromDamage: (damageIndex, imageIndex) =>
    set(state => ({
      damages: state.damages.map((damage, i) =>
        i === damageIndex
          ? {
              ...damage,
              images: (damage.images || []).filter(
                (_, idx) => idx !== imageIndex,
              ),
            }
          : damage,
      ),
    })),

  resetDamages: () => set({damages: []}),
}));
