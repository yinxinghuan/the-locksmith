import { useCallback, useEffect, useState } from 'react';
import './BiddingEngine.less';

import { NODES, ROOT_ID } from './content';
import VideoStage from './primitives/VideoStage';
import ChoiceOverlay from './primitives/ChoiceOverlay';
import EndingCard from './primitives/EndingCard';
import type { Phase } from './types';

const BASE = import.meta.env.BASE_URL;
const videoUrl = (rel: string) => BASE + 'videos/' + rel;
const stillUrl = (rel: string) => BASE + 'stills/' + rel;

export default function BiddingEngine() {
  const [nodeId, setNodeId] = useState<string>(ROOT_ID);
  const [phase, setPhase] = useState<Phase>('playing');

  const node = NODES[nodeId];

  // Preload next-layer end-frames + posters while the current video plays —
  // so the freeze handoff has no black flash.
  useEffect(() => {
    if (!node?.choices) return;
    node.choices.forEach((c) => {
      const n = NODES[c.nextId];
      if (!n) return;
      const img = new Image();
      img.src = stillUrl(n.endFrame);
      if (n.posterFrame) {
        const p = new Image();
        p.src = stillUrl(n.posterFrame);
      }
    });
  }, [nodeId, node]);

  const onVideoEnded = useCallback(() => {
    if (!node) return;
    setPhase(node.isEnding ? 'ending-card' : 'choosing');
  }, [node]);

  const onPick = useCallback((nextId: string) => {
    setPhase('playing');
    setNodeId(nextId);
  }, []);

  const onReplay = useCallback(() => {
    setPhase('playing');
    setNodeId(ROOT_ID);
  }, []);

  if (!node) return null;

  return (
    <div className="bd-root">
      <div className="bd-stage">
        {/* End-frame as freeze backdrop + fallback */}
        <img
          key={`end-${node.id}`}
          className="bd-hero"
          src={stillUrl(node.endFrame)}
          alt=""
          draggable={false}
        />

        {phase === 'playing' && (
          <VideoStage
            key={`v-${node.id}`}
            videoSrc={videoUrl(node.video)}
            posterSrc={node.posterFrame ? stillUrl(node.posterFrame) : stillUrl(node.endFrame)}
            fallbackImg={stillUrl(node.endFrame)}
            onEnded={onVideoEnded}
            holdMs={300}
          />
        )}

        {phase === 'choosing' && node.choices && (
          <ChoiceOverlay choices={node.choices} onPick={onPick} />
        )}

        {phase === 'ending-card' && node.isEnding && node.endingType && (
          <EndingCard
            type={node.endingType}
            titleKey={node.endingTitleKey!}
            taglineKey={node.endingTaglineKey!}
            onReplay={onReplay}
          />
        )}
      </div>
    </div>
  );
}
