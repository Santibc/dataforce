---
to: src/app/<%= module %>/models/<%= Name %>.ts
---
<%
 hasMoment = attrs.indexOf('Moment') > -1
 args = attrs.split(',').map(str => str.split(':'))
%>
<% if(hasMoment){ -%>
  import {Moment} from 'moment'
<% } -%>

interface I<%= Name %>{
  <% args.forEach(([key, value]) => { -%>
    <%= key %>: <%= value %> 
  <% }) -%>
}

export class <%= Name %> {
  <% args.forEach(([key, value]) => { -%>
    <%= key %>: <%= value %>
  <% }) -%>
    
  constructor(args: I<%= Name %>){
    <% args.forEach(([key]) => { -%>
    this.<%= key %> = args.<%= key %> 
    <% }) -%>
  }
}
