---
to: src/app/<%= module %>/forms/<%= name %>Form/initialValues.ts
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

import {
  <%= Name %>FormType,
} from './<%= Name %>FormType';

export const createInitialValues = (): <%= Name %>FormType => ({
  <% args.forEach(([key, value]) => { -%>
    <% if (value.includes('[')) { -%>
      <%= key %>: [],
    <% } -%>
    <% if (!value.includes('[')) { -%>
      <%= key %>: '',
    <% } -%>
  <% }) -%>
});

