---
inject: true
to: src/app/<%= module %>/navigation/index.tsx
before: </Routes>
---

<Route path="list" element={<<%= Name %>TablePage repo={repo}/>} />
<Route path="create" element={<<%= Name %>CreatePage repo={repo}/>} />
<Route path="edit" element={<<%= Name %>EditPage repo={repo}/>} />

