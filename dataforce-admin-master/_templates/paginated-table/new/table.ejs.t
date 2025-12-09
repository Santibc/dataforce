---
to: src/app/<%= module %>/components/<%= Name %>TableComponent.tsx
---

<%
 _cols = cols.split(',').map(str => str.split(':'))
 Model = h.inflection.titleize(model)
%>

import { <%= Model %> } from 'app/<%= module %>/models/<%= Model %>'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useVerifyAction } from '@tanstack/react-query'
import {
  Button,
  ServerSidePagination,
  Table,
  TableColumn,
} from '@vadiun/react-components'

interface Props {
  paginatedData: ServerSidePagination<<%= Model %>[]>
  selectToEdit: (x: <%= Model %>) => void
  delete: (x: <%= Model %>) => void
}

export const <%= Name %>TableComponent = (props: Props) => {
  const verifyAction = useVerifyAction()

  const data = props.paginatedData.data

  const columns: TableColumn<typeof data[0]>[] = [
     <% _cols.forEach(([name, label]) => { -%>
      {
        label: '<%= label %>', 
        name: '<%= name %>'
      },
    <% }) -%>
    {
      label: 'Acciones',
      name: 'id',
      options: {
        filter: false,
        customBodyRenderLite: (index: number) => (
          <div style={{ display: 'flex' }}>
            <Button
              onClick={() => props.selectToEdit(data[index])}
              shape='circle'
              color='primary'
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </Button>
            <Button
              onClick={() =>
                verifyAction({
                  title: 'Estas por Delete un registro!',
                  body: 'Esta accion va a Delete el registro. ¿Estas seguro?',
                  onAccept: () => props.delete(data[index]),
                })
              }
              shape='circle'
              color='red'
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        ),
      },
    },
  ]

 

  return (
    <div className='w-full'>
      <Table
        options={{
          ...props.paginatedData.serverSideProps.options,
          print: false,
          download: false,
        }}
        title={''}
        data={data}
        columns={columns}
      />
    </div>
  )
}
