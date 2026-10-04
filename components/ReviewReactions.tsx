"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Reaction = "exactly" | "partly" | "no";

const options = [
  { value: "exactly" as Reaction, emoji: "👍", label: "Yes, exactly" },
  { value: "partly" as Reaction, emoji: "🤔", label: "Partly" },
  { value: "no" as Reaction, emoji: "👎", label: "Not really" },
];

export default function ReviewReactions({
  movieSlug,
}: {
  movieSlug: string;
}) {
  const [counts, setCounts] = useState<Record<Reaction, number>>({
    exactly: 0,
    partly: 0,
    no: 0,
  });

  const [selected, setSelected] = useState<Reaction | null>(null);
  const [visitorId, setVisitorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCounts(id: string) {
    const { data, error } = await supabase
      .from("review_reactions")
      .select("reaction, visitor_id")
      .eq("movie_slug", movieSlug);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const next: Record<Reaction, number> = {
      exactly: 0,
      partly: 0,
      no: 0,
    };

    data?.forEach((row) => {
      const reaction = row.reaction as Reaction;

      if (reaction in next) {
        next[reaction]++;
      }

      if (row.visitor_id === id) {
        setSelected(reaction);
      }
    });

    setCounts(next);
    setLoading(false);
  }

  useEffect(() => {
    let id = localStorage.getItem("moviehmm_visitor_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("moviehmm_visitor_id", id);
    }

    setVisitorId(id);
    loadCounts(id);
  }, [movieSlug]);

  async function vote(reaction: Reaction) {
    if (!visitorId || saving) return;

    setSaving(true);

    const { error } = await supabase
      .from("review_reactions")
      .upsert(
        {
          movie_slug: movieSlug,
          visitor_id: visitorId,
          reaction,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "movie_slug,visitor_id",
        }
      );

    if (error) {
      console.error(error);
    } else {
      setSelected(reaction);
      await loadCounts(visitorId);
    }

    setSaving(false);
  }

  const total = counts.exactly + counts.partly + counts.no;

  return (
    <section className="reviewReaction">
      <div className="reviewReactionHead">
        <span>YOUR TAKE ON OUR TAKE</span>
        <h2>Did this review match your view?</h2>
      </div>

      <div className="reviewReactionChoices">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={loading || saving}
            onClick={() => vote(option.value)}
            className={
              selected === option.value
                ? "reviewReactionChoice selected"
                : "reviewReactionChoice"
            }
          >
            <span>{option.emoji}</span>
            <strong>{option.label}</strong>
            <small>
              {loading ? "—" : counts[option.value]}
            </small>
          </button>
        ))}
      </div>

      <div className="reviewReactionTotal">
        <strong>{total}</strong>{" "}
        {total === 1 ? "reader responded" : "readers responded"}

        {selected && (
          <span> · Your response is saved</span>
        )}
      </div>
    </section>
  );
}
