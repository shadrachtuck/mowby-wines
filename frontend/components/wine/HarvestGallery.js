'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react';

/** Full width on mobile; fixed frame from md+ */
function slideFrameClasses() {
  return 'min-w-0 w-full max-w-full h-[350px] sm:h-[450px] md:w-[420px] md:h-[520px] lg:w-[500px] lg:h-[600px] overflow-hidden';
}

const SCROLL_END_EPS = 4;

/**
 * What actually overflows the scroller (CSS can be md+ row while isMd in JS
 * is still one frame behind). All scroll/scrollTo logic must use this, not
 * breakpoint state alone.
 */
function getScrollAxis(el) {
  const h = el.scrollWidth - el.clientWidth;
  const v = el.scrollHeight - el.clientHeight;
  if (h > SCROLL_END_EPS && v > SCROLL_END_EPS) {
    return h >= v ? 'x' : 'y';
  }
  if (h > SCROLL_END_EPS) return 'x';
  if (v > SCROLL_END_EPS) return 'y';
  return 'none';
}

/** Web: small icons, zero padding; mobile: up/down, compact rows */
const CHEVRON_CLASS_WEB = 'w-8 h-8 text-gray-800 stroke-2';
const chevronButtonWeb =
  'inline-flex items-center justify-center p-0 leading-none text-gray-800 hover:text-mowby-blue hover:bg-black/5 active:scale-95 transition-transform shrink-0';
const MOBILE_CHEV = 'w-10 h-10 stroke-2 text-gray-900';
const mobileRow = 'md:hidden flex justify-center py-0.5';

const MD_QUERY = '(min-width: 768px)';

function useMediaIsMd() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(MD_QUERY);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => (typeof window !== 'undefined' ? window.matchMedia(MD_QUERY).matches : false),
    () => false
  );
}

/**
 * Nearest slide to viewport center — same content-space math for horizontal + vertical
 * (matches scrollToSlideElement, avoids offsetLeft/offsetTop quirks in flex/overflow).
 * @param {boolean} isX - horizontal (md+) vs vertical (mobile)
 */
function pickNearestIndex(el, isX) {
  const eR = el.getBoundingClientRect();
  const items = el.querySelectorAll('[data-slide-index]');
  if (items.length === 0) return 0;
  if (items.length === 1) return 0;
  if (isX) {
    const maxL = el.scrollWidth - el.clientWidth;
    // At the rail ends, viewport center is often in padding/gap — nearest-center can be wrong; pin index.
    if (maxL <= SCROLL_END_EPS) return 0;
    if (el.scrollLeft <= SCROLL_END_EPS) return 0;
    if (el.scrollLeft >= maxL - SCROLL_END_EPS) return items.length - 1;
    const viewCenter = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < items.length; i++) {
      const node = items[i];
      const nR = node.getBoundingClientRect();
      const centerContent =
        el.scrollLeft + (nR.left - eR.left) + nR.width / 2;
      const d = Math.abs(centerContent - viewCenter);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }
  const maxT = el.scrollHeight - el.clientHeight;
  if (maxT <= SCROLL_END_EPS) return 0;
  if (el.scrollTop <= SCROLL_END_EPS) return 0;
  if (el.scrollTop >= maxT - SCROLL_END_EPS) return items.length - 1;
  const viewCenterY = el.scrollTop + el.clientHeight / 2;
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < items.length; i++) {
    const node = items[i];
    const nR = node.getBoundingClientRect();
    const centerContent =
      el.scrollTop + (nR.top - eR.top) + nR.height / 2;
    const d = Math.abs(centerContent - viewCenterY);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

function useGalleryScroll(scrollerRef, slideCount) {
  const [scrollable, setScrollable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const axis = getScrollAxis(el);
    if (axis === 'none') {
      setScrollable(false);
      setActiveIndex(0);
      return;
    }
    setScrollable(true);
    const isX = axis === 'x';
    const idx = pickNearestIndex(el, isX);
    setActiveIndex(Math.min(Math.max(0, idx), Math.max(0, slideCount - 1)));
  }, [scrollerRef, slideCount]);

  return { activeIndex, scrollable, update };
}

/** Sum of offsetLeft/Top from `node` up to (not including) `scroller` — layout box, ignores CSS transforms (Framer). */
function offsetAlongAxisInScroller(scroller, node, axis) {
  let acc = 0;
  let n = node;
  while (n && n !== scroller) {
    const p = n.offsetParent;
    if (!p) return null;
    acc += axis === 'x' ? n.offsetLeft : n.offsetTop;
    n = p;
  }
  return n === scroller ? acc : null;
}

/**
 * Scroll so the slide’s layout start aligns with the scroller start, clamped to the scroll range.
 * getBoundingClientRect() is wrong here when motion applies transforms (pre-fix: nextLeft > maxL, no movement).
 */
function scrollToSlideElement(el, child, isHorizontal) {
  if (isHorizontal) {
    const maxL = Math.max(0, el.scrollWidth - el.clientWidth);
    let nextLeft = offsetAlongAxisInScroller(el, child, 'x');
    if (nextLeft == null) {
      const eR = el.getBoundingClientRect();
      const cR = child.getBoundingClientRect();
      nextLeft = el.scrollLeft + cR.left - eR.left;
    }
    nextLeft = Math.max(0, Math.min(nextLeft, maxL));
    el.scrollTo({ left: nextLeft, top: 0, behavior: 'smooth' });
  } else {
    const maxT = Math.max(0, el.scrollHeight - el.clientHeight);
    let nextTop = offsetAlongAxisInScroller(el, child, 'y');
    if (nextTop == null) {
      const eR = el.getBoundingClientRect();
      const cR = child.getBoundingClientRect();
      nextTop = el.scrollTop + cR.top - eR.top;
    }
    nextTop = Math.max(0, Math.min(nextTop, maxT));
    el.scrollTo({ top: nextTop, left: 0, behavior: 'smooth' });
  }
}

function HarvestGalleryContent({ title, slides }) {
  const scrollerRef = useRef(null);
  const isMd = useMediaIsMd();
  const { activeIndex, scrollable, update } = useGalleryScroll(
    scrollerRef,
    slides.length
  );

  /** Navigate from displayed index (not a fresh nearest-at-click) so prev/next match UI at scroll ends */
  const scrollToIndex = useCallback(
    (i) => {
      const el = scrollerRef.current;
      if (!el) return;
      const axis = getScrollAxis(el);
      if (axis === 'none') return;
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      const item = el.querySelector(`[data-slide-index="${clamped}"]`);
      if (!item) return;
      scrollToSlideElement(el, item, axis === 'x');
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (getScrollAxis(el) === 'none') return;
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);
  const goPrev = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const axis = getScrollAxis(el);
    if (axis === 'none') return;
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [update, slides.length]);

  useEffect(() => {
    if (!scrollerRef.current) return;
    update();
  }, [isMd, update]);

  const showPrev = scrollable && activeIndex > 0;
  const showNext = scrollable && activeIndex < slides.length - 1;

  /** L/R (md) and up/down (mobile) — same behavior; only placement/icon differs */
  const nav = {
    onPrev: goPrev,
    onNext: goNext,
    showPrev,
    showNext,
  };

  return (
    <div className="bg-mowby-cream py-12 md:py-16">
      <div className="mb-8 md:mb-12 px-4 sm:px-6 lg:px-[100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <h2 className="text-2xl md:text-4xl font-display text-black tracking-tight">
            {title}
          </h2>
          <ChevronRight
            className="w-6 h-6 md:w-8 md:h-8 text-gray-900 flex-shrink-0"
            aria-hidden
          />
        </motion.div>
      </div>

      {nav.showPrev && (
        <div className={mobileRow}>
          <button
            type="button"
            onClick={nav.onPrev}
            className="p-0 leading-none hover:text-mowby-blue active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronUp className={MOBILE_CHEV} aria-hidden />
          </button>
        </div>
      )}

      <div className="flex min-w-0 items-stretch md:items-center md:gap-0 md:pr-2">
        {nav.showPrev && (
          <button
            type="button"
            onClick={nav.onPrev}
            className={'hidden md:inline-flex ' + chevronButtonWeb}
            aria-label="Previous photo"
          >
            <ChevronLeft className={CHEVRON_CLASS_WEB} aria-hidden />
          </button>
        )}

        <div
          ref={scrollerRef}
          className="flex min-w-0 flex-1 -mx-4 flex-col items-center gap-6 overflow-y-auto overflow-x-hidden scroll-smooth px-4 pb-2
            max-h-[525px] sm:max-h-[675px] max-md:snap-y max-md:snap-mandatory
            md:mx-0 md:max-h-none md:flex-row md:items-stretch md:gap-4 md:overflow-x-auto md:overflow-y-visible md:px-0 md:pb-4 md:pl-0 md:pr-0
            md:snap-x md:snap-mandatory"
        >
          {slides.map((img, i) => (
            <motion.div
              key={`${img.src}-${i}`}
              data-slide-index={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="w-full min-w-0 flex-shrink-0 snap-center md:w-auto"
            >
              <div className={slideFrameClasses()}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {nav.showNext && (
          <button
            type="button"
            onClick={nav.onNext}
            className={'hidden md:inline-flex ' + chevronButtonWeb}
            aria-label="Next photo"
          >
            <ChevronRight className={CHEVRON_CLASS_WEB} aria-hidden />
          </button>
        )}
      </div>

      {nav.showNext && (
        <div className={mobileRow}>
          <button
            type="button"
            onClick={nav.onNext}
            className="p-0 leading-none hover:text-mowby-blue active:scale-95"
            aria-label="Next photo"
          >
            <ChevronDown className={MOBILE_CHEV} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

export default function HarvestGallery({ title, slides }) {
  return <HarvestGalleryContent title={title} slides={slides} />;
}
