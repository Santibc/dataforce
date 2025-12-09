---
to: src/app/<%= module %>/forms/<%= name %>Form/<%= Name %>Form.tsx
---
<%
 args = attrs.split(',').map(str => str.split(':')).map(([key, value]) => {
    let finalValue = value
    let fieldType = ''
    if(value.includes('(')){
      finalValue = value.split('(')[0]
      fieldType = value.split('(')[1].replace('(', '').replace(')', '')
    }
    return {
      key,
      value: finalValue,
      fieldType
    }
 })
%>

import React, { useEffect, useRef } from "react";
import { Field, Form, Formik } from "formik";
import { Button } from "@vadiun/react-components";
import { createInitialValues } from "./initialValues";
import { <%= Name %>FormType } from "./<%= Name %>FormType";
import { validation } from "./validation";
import { TextField, Checkbox, Select, RadioGroup } from "formik-mui";
import { DesktopDateTimePicker } from "formik-mui-lab";
import {MenuItem, Radio, FormControlLabel} from "@mui/material"

interface Props {
  onSubmit: (value: <%= Name %>FormType) => Promise<any>;
  initialValues?: <%= Name %>FormType;
  <% args.forEach(({key,value, fieldType}) => { -%>
    <% if (fieldType === 'select' || fieldType === 'radio') { -%>
      <%= key %>Options:<%= value %>[]
    <% } -%>
  <% }) -%>
}

export function <%= Name %>Form({
  onSubmit,
  initialValues = createInitialValues(),
  <% args.forEach(({key,value, fieldType}) => { -%>
    <% if (fieldType === 'select' || fieldType === 'radio') { -%>
      <%= key %>Options,
    <% } -%>
  <% }) -%>
}: Props) {
  return (
    <Formik<<%= Name %>FormType>
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="grid w-full grid-cols-6 gap-6">

        <% args.forEach(({key,value, fieldType}) => { -%>

           <% if (fieldType === 'select') { -%>
               <Field
                   name="<%= key %>"
                   label="<%= key %> *"
                   className="col-span-6"
                   component={Select}
                >
                {<%= key %>Options.map(option =>  <MenuItem value={option}>{option}</MenuItem>)}
                </Field>
             <% } -%>
            <% if (fieldType === 'radio') { -%>
               <Field
                  name="<%= key %>"
                  label="<%= key %> *"
                  className="col-span-6"
                  component={RadioGroup}
               >
               {<%= key %>Options.map(option => <FormControlLabel value={option} control={<Radio />} label={option} />)}
               </Field>
            <% } -%>
            <% if (value === 'string' && fieldType !== 'radio' && fieldType !== 'select') { -%>
              <Field
                 name="<%= key %>"
                 label="<%= key %> *"
                 className="col-span-6"
                 component={TextField}
               />
            <% } -%>
            <% if (value === 'number' && fieldType !== 'radio' && fieldType !== 'select') { -%>
                <Field
                  name="<%= key %>"
                  label="<%= key %> *"
                  className="col-span-6"
                  type="number"
                  component={TextField}
                />
             <% } -%>
            <% if (value === 'boolean' && fieldType !== 'radio' && fieldType !== 'select') { -%>
             <Field
                name="<%= key %>"
                label="<%= key %> *"
                className="col-span-6"
                component={Checkbox}
             />
             <% } -%>
            <% if (value === 'Moment' && fieldType !== 'radio' && fieldType !== 'select') { -%>
             <Field
                component={DesktopDateTimePicker}
                label="<%= key %>"
                name="<%= key %>"
                ampm={false}
                textField={{ fullWidth: true, margin: "normal" }}
                inputFormat="DD/MM/YYYY HH:mm"
                />
            <% } -%>

        <% }) -%>
          <div className="col-span-6 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="green"
              isLoading={formik.isSubmitting}
              disabled={formik.isSubmitting}
            >
              Guardar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
