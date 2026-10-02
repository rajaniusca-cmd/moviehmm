# Movie-Hmm

No hype. No hate. Just the movie.

## Daily review workflow

1. Put the poster in `public/posters/`.
2. Add one JSON file in `content/reviews/`.
3. Set `"featured": true` only for the movie currently in the homepage banner.
4. Set all other reviews to `"featured": false`.
5. `git add . && git commit -m "Add review: Movie Name" && git push`

Homepage, index, review page and sitemap are generated automatically from review JSON files.


## Production editorial standard

Score language is fixed:
- 9.0–10: HMM★ WOW
- 8.0–8.9: HMM✓ YES
- 7.0–7.9: HMM✓ GOOD
- 6.0–6.9: HMM? MAYBE
- Below 6: HMM× NO

Homepage:
- Exactly one review has `featured: true`.
- Other reviews are ordered by `displayOrder`, then published date.
- Keep poster art visually simple enough to read at card size.
- The alphabetical index is intentionally hidden until the library is large enough.

Daily publishing requires only a poster and one JSON review file.

## Launch checklist

- Add a dedicated Movie-Hmm contact email before public promotion.
- Do not use ® unless federal trademark registration is actually granted.
- Review Privacy Policy before enabling analytics, advertising, newsletters, accounts, or non-essential cookies.
- A formal DMCA designated-agent notice requires actual Copyright Office designation and real contact details.
- Do not publish ticket confirmation numbers, QR codes, order IDs, or payment details.
