---
to: src/app/<%= module %>/services/<%= name %>Repository.ts
---

import { <%= Name %> } from 'app/<%= module %>/models/<%= Name %>'
import { httpClient } from 'shared/services/httpClient'

export const get<%= Name %>Mapper = (x: any): <%= Name %> => new <%= Name %>(x)

export interface ICreate<%= Name %>{

}

export const create<%= Name %>Mapper = (x: ICreate<%= Name %>) => x

export interface IUpdate<%= Name %>{
    id: string
}

export const update<%= Name %>Mapper = (x: IUpdate<%= Name %>) => x

export class <%= Name %>Repository{
    keys = {
        all: () => ['<%= name %>'],
        one: (id: string) => ['<%= name %>', id]
    }

    getAll = async () => {
        const res = await httpClient.get('<%= h.inflection.pluralize(name) %>')
        return res.map(get<%= Name %>Mapper)
    }

    get = async (id: string) => {
        const res = await httpClient.get(`<%= h.inflection.pluralize(name) %>/${id}`)
        return get<%= Name %>Mapper(res)
    }

    create = async (x: ICreate<%= Name %>) => 
        httpClient.post('<%= h.inflection.pluralize(name) %>', create<%= Name %>Mapper(x))

    update = async (x: IUpdate<%= Name %>) => 
        httpClient.put(`<%= h.inflection.pluralize(name) %>/${x.id}`, update<%= Name %>Mapper(x))

    delete = async (id: string) => httpClient.delete(`<%= h.inflection.pluralize(name) %>/${id}`);

}
