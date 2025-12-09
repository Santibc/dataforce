---
to: src/app/<%= module %>/components/<%= Name %>TableComponent.tsx
---
<%
 _cols = cols.split(',').map(str => str.split(':'))
%>

import { <%= Name %> } from 'app/<%= module %>/models/<%= Name %>'
import { FaEllipsisH, FaPencilAlt, FaTrash } from "react-icons/fa" 
import { useVerifyAction } from '@tanstack/react-query'
import {
  Table,
  TableColumn,
} from '@vadiun/react-components'
import { Link } from "react-router-dom"
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

interface Props {
  data: <%= Name %>[]
  editLink: (id: string) => string
  onDelete: (id: string) => void
}

export const <%= Name %>TableComponent = (props: Props) => {
  const verifyAction = useVerifyAction()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [indexOpen, setIndexOpen] = useState<Number>();

  const open = Boolean(anchorEl);

  const data = props.data

  const columns: TableColumn<typeof data[0]>[] = [
    <% _cols.forEach(([name, label]) => { -%>
      {
        label: '<%= label %>', 
        name: '<%= name %>'
      },
    <% }) -%>
    {
      label: 'Actions',
      name: 'id',
      options: {
        filter: false,
        customBodyRenderLite: (index: number) => (
          <>
            <IconButton
              onClick={(ev) => {
                setAnchorEl(ev.currentTarget);
                setIndexOpen(index);
              }}
            >
              <FaEllipsisH className="text-sm" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open && indexOpen === index}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem component={Link} to={`../edit/${data[index].id}`}>
                <ListItemIcon>
                  <FaPencilAlt />
                </ListItemIcon>
                <ListItemText>Edit company</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() =>
                  verifyAction({
                    title: "You are about to delete a record!",
                    body: "This action is going to delete a record. ¿Are you sure?",
                    onAccept: () => props.onDelete(data[index].id),
                  })
                }
              >
                <ListItemIcon>
                  <FaTrash />
                </ListItemIcon>
                <ListItemText>Delete company</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ),
      },
    },
  ]

  return (
    <div className='w-full'>
      <Table
        options={{
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
