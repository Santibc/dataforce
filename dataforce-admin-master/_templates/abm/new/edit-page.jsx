---
to: src/app/<%= module %>/pages/<%= Name %>EditPage.tsx
---


<% if (locals.repo) { -%>
  import {<%= h.inflection.titleize(repo) %>Repository} from 'app/<%= module %>/services/<%= repo %>Repository'
<% } -%>
    import { Breadcrumbs, Button, Link } from "@mui/material"
    import { useMutation, useSuperQuery } from "@tanstack/react-query"
    import { PageBody, PageContainer } from 'layout/components'
    import { useQueryClient } from "react-query"
    import { useParams } from "react-router-dom"
    import { Card } from "shared/components"
    import { } from <
        
%= Name %>Form } from "app/<%= module %>/forms/<%= name %>Form/<%= Name %>Form"

interface Props{
  <% if (locals.repo) { -%>
    repo: <%= h.inflection.titleize(repo) %>Repository
  <% } -%>
}

export const <%= Name %>EditPage = ({
  <% if (locals.repo) { -%>
    repo,
  <% } -%>
}: Props)  => {
    const queryClient = useQueryClient()
    const params = useParams<{id: string}>()
    const <%= name %>Query = useSuperQuery(repo.keys.one(params.id!), () => repo.get(params.id!) )
    const editMutation = useMutation(repo.update, {
      onSuccess: () => queryClient.invalidateQueries(repo.keys.all()),
      }
    )

    return <PageContainer title="<%= Name %>" child subtitle={
      <Breadcrumbs className="text-sm">
      <Link href="../list" underline="hover" className="text-typo-500">
        <%= Name %> list
      </Link>
      <Link href="" underline="none" className="text-typo-500">
        Edit <%= name %>
      </Link>
    </Breadcrumbs>
    }
    toolbar={
      <Button href="../list" className="hidden sm:inline-flex">
      Back
    </Button>
    }>
      <PageBody>
        <Card className="sm:p-8">
          <<%= Name %>Form 
            initialValues={<%= name %>Query.data}
            onSubmit={(values) => editMutation.mutateAsync({...values, id: params.id!})}
          />
        </Card>
      </PageBody>
   </PageContainer>
}
