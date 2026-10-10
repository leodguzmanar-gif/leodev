// src/utils/useVisible.js
(function () {
  const { useEffect, useRef, useState, useCallback } = React;

  function useVisible(options) {
    options = options || {};

    const threshold = options.threshold !== undefined ? options.threshold : 0.1;
    const rootMargin = options.rootMargin || '0px';
    const root = options.root || null;
    const once = options.once || false;

    const ref = useRef(null);
    const observerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [ratio, setRatio] = useState(0);

    useEffect(function () {
      const node = ref.current;
      if (!node) return;

      if (typeof IntersectionObserver === 'undefined') {
        setVisible(true);
        setRatio(1);
        return;
      }

      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          setVisible(entry.isIntersecting);
          setRatio(entry.intersectionRatio);
          if (once && entry.isIntersecting) {
            observer.disconnect();
            observerRef.current = null;
          }
        },
        { threshold: threshold, rootMargin: rootMargin, root: root }
      );

      observer.observe(node);
      observerRef.current = observer;

      return function () {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    }, [threshold, rootMargin, root, once]);

    const reobserve = useCallback(function () {
      if (observerRef.current && ref.current) {
        observerRef.current.disconnect();
        observerRef.current.observe(ref.current);
      }
    }, []);

    return [ref, visible, ratio, reobserve];
  }

  window.useVisible = useVisible;
})();