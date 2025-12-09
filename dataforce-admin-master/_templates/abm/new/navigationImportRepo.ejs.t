---
inject: true
to: src/app/<%= module %>/navigation/index.tsx
prepend: true
skip_if: <%= h.inflection.titleize(repo) %>Repository
---

<% if (locals.repo) { -%>
import {<%= h.inflection.titleize(repo) %>Repository} from "app/<%= module %>/services/<%= repo %>Repository"
<% } -%>
