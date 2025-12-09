---
to: src/app/<%= module %>/forms/<%= name %>Form/<%= Name %>FormType.ts
---
<%
 args = attrs.split(',').map(str => {
  const [key,value] = str.split(':')
    return [
      key,
      value.split('(')[0]
    ]
 })
%>

export type <%= Name %>FormType = {
  <% args.forEach(([key, value]) => { -%>
    <%= key %>: <%= value %>
  <% }) -%>
}
