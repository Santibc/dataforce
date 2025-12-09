---
inject: true
to: src/app/<%= module %>/navigation/index.tsx
prepend: true
---

import {<%= Name %>EditPage} from "app/<%= module %>/pages/<%= Name %>EditPage"
import {<%= Name %>CreatePage} from "app/<%= module %>/pages/<%= Name %>CreatePage"
import {<%= Name %>TablePage} from "app/<%= module %>/pages/<%= Name %>TablePage"

