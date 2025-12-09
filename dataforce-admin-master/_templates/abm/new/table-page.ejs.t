---
to: src/app/<%= module %>/pages/<%= Name %>TablePage.tsx
---


<% if (locals.repo) { -%>
  import {<%= h.inflection.titleize(repo) %>Repository} from 'app/<%= module %>/services/<%= repo %>Repository'
<% } -%>
import {<%= Name %>TableComponent} from 'app/<%= module %>/components/<%= Name %>TableComponent'
import { PageContainer, PageBody} from 'layout/components'
import { Card } from "shared/components"
import { useSuperQuery, useMutation } from "@tanstack/react-query"
import { useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import { Button } from "@vadiun/react-components"

interface Props{
  <% if (locals.repo) { -%>
    repo: <%= h.inflection.titleize(repo) %>Repository
  <% } -%>
}

export const <%= Name %>TablePage = ({
  <% if (locals.repo) { -%>
    repo,
  <% } -%>
}: Props)  => {
    const queryClient = useQueryClient()
    const <%= name %>Query = useSuperQuery(repo.keys.all(), repo.getAll)
    const deleteMutation = useMutation(repo.delete, {
      onSuccess: () => queryClient.invalidateQueries(repo.keys.all()),
    })

    return <PageContainer title="<%= Name %>" toolbar={(
        <Link to="../create">
          <Button>New <%= Name %></Button>
          </Link>)}>
      <PageBody>
        <Card>
          <<%= Name %>TableComponent 
            data={<%= name %>Query.data ?? []}
            editLink={(id) => `../edit/${id}`}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </Card>
      </PageBody>
   </PageContainer>
}
