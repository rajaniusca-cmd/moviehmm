"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Reaction = "love" | "good" | "hmm" | "no";

const options = [
  { value: "love" as Reaction, emoji: "😍", label: "Loved it" },
  { value: "good" as Reaction, emoji: "🙂", label: "Good" },
  { value: "hmm" as Reaction, emoji: "🤔", label: "Hmm..." },
  { value: "no" as Reaction, emoji: "😕", label: "Not for me" },
];

export default function MovieReactions({
  movieSlug,
}: {
  movieSlug: string;
}) {
  const [counts, setCounts] = useState<Record<Reaction, number>>({
    love: 0,
    good: 0,
    hmm: 0,
    no: 0,
  });

  const [selected, setSelected] = useState<Reaction | null>(null);
  const [visitorId, setVisitorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCounts(id: string) {
    const { data, error } = await supabase
      .from("movie_reactions")
      .select("reaction, visitor_id")
      .eq("movie_slug", movieSlug);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const next: Record<Reaction, number> = {
      love: 0,
      good: 0,
      hmm: 0,
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
      .from("movie_reactions")
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

  const total =
    counts.love +
    counts.good +
    counts.hmm +
    counts.no;

  return (
    <section className="readerReaction">
      <div className="readerReactionHead">
        <span>READER REACTION</span>
        <h2>What did you think?</h2>
        <p>Your movie. Your reaction.</p>
      </div>

      <div className="reactionChoices">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={loading || saving}
            onClick={() => vote(option.value)}
            className={
              selected === option.value
                ? "reactionChoice selected"
                : "reactionChoice"
            }
          >
            <span className="reactionEmoji">
              {option.emoji}
            </span>

            <strong>{option.label}</strong>

            <small>
              {loading ? "—" : counts[option.value]}
            </small>
          </button>
        ))}
      </div>

      <div className="reactionTotal">
        <strong>{total}</strong>{" "}
        {total === 1 ? "reader reaction" : "reader reactions"}

        {selected && (
          <span> · Your reaction is saved</span>
        )}
      </div>
    </section>
  );
}
