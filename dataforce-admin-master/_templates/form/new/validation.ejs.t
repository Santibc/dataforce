---
to: src/app/<%= module %>/forms/<%= name %>Form/validation.ts
---
<%
 args = attrs.split(',').map(str => {
  const [key,value] = str.split(':')
    if(value.includes('[')){
      return [
        key,
        'array'
      ]
    }
    return [
      key,
      'string'
    ]
 })
%>

import { <%= Name %>FormType } from './<%= Name %>FormType'
import * as Yup from 'yup'

export const validation: Yup.SchemaOf<<%= Name %>FormType> =
  Yup.object().shape({
  <% args.forEach(([key, value]) => { -%>
    <%= key %>: Yup.<%= value %>().required('Requerido'),
  <% }) -%>
})
