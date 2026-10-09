"use client";

import { useEffect } from "react";

export default function SectionReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll(
      "#trending, #binge-file"
    );

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("mhRevealVisible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
