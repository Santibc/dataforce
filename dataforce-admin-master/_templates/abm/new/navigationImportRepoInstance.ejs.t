---
inject: true
to: src/app/<%= module %>/navigation/index.tsx
skip_if: new
before: export
---

<% if (locals.repo) { -%>
const repo = new <%= h.inflection.titleize(repo) %>Repository()
<% } -%>
