import { useCallback, useEffect, useMemo, useState } from 'react';
import './BiddingEngine.less';

import { NODES, ROOT_ID } from './content';
import VideoStage from './primitives/VideoStage';
import ChoiceOverlay from './primitives/ChoiceOverlay';
import HotspotPin from './primitives/HotspotPin';
import EndingCard from './primitives/EndingCard';
import IntroOverlay from './primitives/IntroOverlay';
import type { Phase } from './types';

const BASE = import.meta.env.BASE_URL;
const videoUrl = (rel: string) => BASE + 'videos/' + rel;
const stillUrl = (rel: string) => BASE + 'stills/' + rel;

// Image-percent → viewport-percent mapping for 3:4 hero rendered on a 9:19+
// phone screen with object-fit: cover. See [[platform-safe-area-13pct]].
//   image edges (0, 100) → viewport edges (-13, 113)
//   image visible range [13, 87] → viewport [0, 100]
const imageXToViewport = (p: number) => -13 + p * 1.26;

export default function BiddingEngine() {
  const [nodeId, setNodeId] = useState<string>(ROOT_ID);
  const [phase, setPhase] = useState<Phase>('intro');

  // The bd-hero img src is CONTROLLED — it does NOT change when nodeId
  // changes. It only changes when we explicitly setStableSrc (when video
  // ends, or on replay). This is what kills the "flash of new endFrame"
  // bug: during the choice→next-video transition, bd-hero keeps showing
  // the previous endFrame (= new video's first frame = video element's
  // poster), so the seam is invisible.
  const [stableSrc, setStableSrc] = useState<string>(
    stillUrl(NODES[ROOT_ID].posterFrame || NODES[ROOT_ID].endFrame),
  );

  const node = NODES[nodeId];

  // Preload next-layer end-frames + posters while the current video plays —
  // so the freeze handoff has no black flash.
  useEffect(() => {
    if (!node?.choices) return;
    node.choices.forEach((c) => {
      const n = NODES[c.nextId];
      if (!n) return;
      const img = new Image(); img.src = stillUrl(n.endFrame);
      if (n.posterFrame) {
        const p = new Image(); p.src = stillUrl(n.posterFrame);
      }
    });
  }, [nodeId, node]);

  const onVideoEnded = useCallback(() => {
    if (!node) return;
    // Pin the freeze to the video's last frame BEFORE phase change — so
    // when VideoStage unmounts the bd-hero behind is already showing the
    // matching still. Snap-cut is invisible.
    setStableSrc(stillUrl(node.endFrame));
    setPhase(node.isEnding ? 'ending-card' : 'choosing');
  }, [node]);

  const onPick = useCallback((nextId: string) => {
    // DO NOT touch stableSrc — keep showing the current freeze frame, which
    // also equals the new video's first frame (chain continuity).
    setPhase('playing');
    setNodeId(nextId);
  }, []);

  const onReplay = useCallback(() => {
    setStableSrc(stillUrl(NODES[ROOT_ID].posterFrame || NODES[ROOT_ID].endFrame));
    setNodeId(ROOT_ID);
    setPhase('intro');
  }, []);

  const onBegin = useCallback(() => {
    setPhase('playing');
  }, []);

  // Pin viewport coords derived from each choice's image-percent.
  const pinView = useMemo(() => {
    if (!node?.choices) return [];
    return node.choices.map((c) => ({
      ...c,
      vx: imageXToViewport(c.pinX),
      vy: c.pinY,  // vertical isn't cropped by the 3:4-on-9:19 cover, no remap needed
    }));
  }, [node]);

  if (!node) return null;

  return (
    <div className="bd-root">
      <div className="bd-stage">
        {/* Controlled freeze backdrop — only updates when we say so */}
        <img
          className="bd-hero"
          src={stableSrc}
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
            holdMs={250}
          />
        )}

        {phase === 'choosing' && node.choices && (
          <>
            {pinView.map((c) => (
              <HotspotPin
                key={`pin-${c.nextId}`}
                vx={c.vx}
                vy={c.vy}
                labelKey={c.labelKey}
                onTap={() => onPick(c.nextId)}
              />
            ))}
            <ChoiceOverlay choices={node.choices} onPick={onPick} />
          </>
        )}

        {phase === 'ending-card' && node.isEnding && node.endingType && (
          <EndingCard
            type={node.endingType}
            titleKey={node.endingTitleKey!}
            taglineKey={node.endingTaglineKey!}
            onReplay={onReplay}
          />
        )}

        {phase === 'intro' && <IntroOverlay onBegin={onBegin} />}
      </div>
    </div>
  );
}
