import { useEffect, useState } from 'react';
import { t } from '../i18n';
import type { ChoiceDef } from '../types';
import './ChoiceOverlay.less';

interface Props {
  choices: ChoiceDef[];
  onPick: (nextId: string) => void;
}

export default function ChoiceOverlay({ choices, onPick }: Props) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={`bd-choices ${armed ? 'is-armed' : ''}`}>
      {choices.map((c, i) => (
        <button
          key={c.nextId}
          className="bd-choice"
          style={{ animationDelay: `${260 + i * 200}ms` }}
          onPointerDown={(e) => {
            e.preventDefault();
            onPick(c.nextId);
          }}
        >
          {t(c.labelKey)}
        </button>
      ))}
    </div>
  );
}
