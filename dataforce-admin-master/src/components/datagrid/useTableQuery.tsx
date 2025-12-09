import { DataGridProps, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
  QueryFunctionContext,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { createContext, useContext, useRef } from 'react';
import { httpClient } from 'src/utils/httpClient';

interface OrderCriteria {
  name: string;
  direction: 'asc' | 'desc';
}

//type ServerRequestFn<T> = (params: string) => Promise<RequestFnResponse<T>>;

interface ServerSidePaginationProps {
  paginationLabel: string;
  firstPageNro: number;
  itemsPerPageLabel: string;
  defaultItemsPerPage: number;
}

interface ServerSideFilterProps {
  filterLabel: string;
}

interface ServerSideSearchProps {
  searchLabel: string;
}

interface ServerSideSortProps {
  orderLabel: string;
  orderDirectionLabel: string;
  orderDirectionAscLabel: string;
  orderDirectionDescLabel: string;
}

export type TableServerSideOptions = ServerSidePaginationProps &
  ServerSideFilterProps &
  ServerSideSortProps &
  ServerSideSearchProps;

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export type ServerSideDatagridOptions = Partial<DataGridProps> & {
  onExport: () => any;
  onFilterChange: (filters: any) => any;
};

export declare type UseTableQueryResult<TData extends unknown[], TError> = UseQueryResult<
  TData,
  TError
> & {
  serverSideOptions: ServerSideDatagridOptions;
};

class ParamsBuilder {
  searchValue: string = '';
  orderValue: OrderCriteria | null = null;
  filterValue: { name: string; value: string | string[] }[] = [];
  itemsPerPage: number;
  page: number | null = null;
  options: TableServerSideOptions;

  constructor(options: TableServerSideOptions) {
    this.options = options;
    this.itemsPerPage = options.defaultItemsPerPage;
  }

  setSearch(search: string) {
    this.searchValue = search;
    return this;
  }

  setOrder(order: OrderCriteria) {
    this.orderValue = order;
    return this;
  }

  setFilter(filter: { name: string; value: string }[]) {
    this.filterValue = filter;
    return this;
  }

  setItemsPerPage(items: number) {
    this.itemsPerPage = items;
    return this;
  }

  setPage(pageNumber: number) {
    this.page = pageNumber;
    return this;
  }

  clearPage() {
    this.page = null;
    return this;
  }

  toURLSearchParams() {
    const searchParams = new URLSearchParams();
    if (this.page) {
      searchParams.append(this.options.paginationLabel, this.page.toString());
    }
    if (this.itemsPerPage) {
      searchParams.append(this.options.itemsPerPageLabel, this.itemsPerPage.toString());
    }
    if (this.searchValue) {
      searchParams.append(this.options.searchLabel, this.searchValue);
    }
    if (this.orderValue) {
      searchParams.append(this.options.orderLabel, this.orderValue.name);
      searchParams.append(
        this.options.orderDirectionLabel,
        this.orderValue.direction === 'asc'
          ? this.options.orderDirectionAscLabel
          : this.options.orderDirectionDescLabel
      );
    }
    this.filterValue.forEach((item) => {
      if (Array.isArray(item.value)) {
        item.value.forEach((value) => {
          searchParams.append(`${this.options.filterLabel}[${item.name}][]`, value);
        });
        return;
      }
      searchParams.append(`${this.options.filterLabel}[${item.name}]`, item.value);
    });
    return searchParams;
  }
}

type TableContextType = {
  options: TableServerSideOptions;
  localization: 'ES' | 'EN';
};
const TableHandlerContext = createContext({} as TableContextType);

export const TableProvider = ({
  children,
  options,
  localization,
}: {
  children: React.ReactNode;
  options: TableServerSideOptions;
  localization: 'ES' | 'EN';
}) => (
  <TableHandlerContext.Provider
    value={{
      options,
      localization,
    }}
  >
    {children}
  </TableHandlerContext.Provider>
);

export const useTableContext = () => {
  const context = useContext(TableHandlerContext);
  if (!context.options) {
    throw new Error('useTableHandler must be used inside TableHandlerProvider');
  }
  return context;
};

export const useTableQuery = <
  TQueryFnData extends PaginatedResponse<unknown>,
  TError = unknown,
  TData extends PaginatedResponse<unknown> = TQueryFnData,
  TQueryKey extends QueryKey = [string, string]
>(
  options: {
    queryKey: TQueryKey;
    queryFn: (
      params: URLSearchParams,
      context?: QueryFunctionContext<TQueryKey>
    ) => TQueryFnData | Promise<TQueryFnData>;
  } & Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'> &
    Partial<TableServerSideOptions> & {
      exportUrl: string;
    }
): UseTableQueryResult<TData['data'], TError> => {
  const { options: defaultTableOptions } = useTableContext();
  const exportMutation = useMutation({
    mutationFn: () =>
      httpClient.get(options.exportUrl, {
        responseType: 'blob',
      }),
  });

  const tableOptions = {
    paginationLabel: options?.paginationLabel ?? defaultTableOptions.paginationLabel,
    firstPageNro: options?.firstPageNro ?? defaultTableOptions.firstPageNro,
    itemsPerPageLabel: options?.itemsPerPageLabel ?? defaultTableOptions.itemsPerPageLabel,
    defaultItemsPerPage: options?.defaultItemsPerPage ?? defaultTableOptions.defaultItemsPerPage,
    filterLabel: options?.filterLabel ?? defaultTableOptions.filterLabel,
    searchLabel: options?.searchLabel ?? defaultTableOptions.searchLabel,
    orderLabel: options?.orderLabel ?? defaultTableOptions.orderLabel,
    orderDirectionLabel: options?.orderDirectionLabel ?? defaultTableOptions.orderDirectionLabel,
    orderDirectionAscLabel:
      options?.orderDirectionAscLabel ?? defaultTableOptions.orderDirectionAscLabel,
    orderDirectionDescLabel:
      options?.orderDirectionDescLabel ?? defaultTableOptions.orderDirectionDescLabel,
  };

  const initialParams = new ParamsBuilder(tableOptions);
  const queryParamsRef = useRef(initialParams);

  const handleFilterChange = (filters: any) => {
    const formatted = Object.entries(filters).map(([key, value]) => ({
      name: key,
      value: value as any,
    }));
    queryParamsRef.current.setFilter(formatted);
    query.refetch();
  };

  const handlePaginationModelChange = (paginationModel: GridPaginationModel) => {
    queryParamsRef.current.setPage(paginationModel.page);
    queryParamsRef.current.setItemsPerPage(paginationModel.pageSize);
    query.refetch();
  };

  const handleSortModelChange = (model: GridSortModel) => {
    const sortColumn = model.find((x) => x.sort);
    if (sortColumn) {
      const sort = {
        name: sortColumn.field,
        direction: sortColumn.sort!,
      };
      queryParamsRef.current.setOrder(sort);
    }
    query.refetch();
  };

  const handleExport = async () => {
    const res = await exportMutation.mutateAsync();
    const url = window.URL.createObjectURL(new Blob([res.data as any]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: options.queryKey,
    queryFn: async (context) => {
      const res = await options.queryFn(queryParamsRef.current.toURLSearchParams(), context);
      queryParamsRef.current.setPage(tableOptions.firstPageNro);
      queryParamsRef.current.setPage(res.current_page);
      queryParamsRef.current.setItemsPerPage(res.per_page);
      return res;
    },
    keepPreviousData: true,
  });

  const serverSideOptions: ServerSideDatagridOptions = {
    paginationMode: 'server',
    rowCount: query.data ? query.data.total : 0,
    loading: query.isFetching || exportMutation.isLoading,
    onPaginationModelChange: handlePaginationModelChange,
    paginationModel: {
      page: query.data ? query.data.current_page : 0,
      pageSize: query.data ? query.data.per_page : 5,
    },
    filterMode: 'server',
    //onFilterModelChange: handleFilterChange,
    onFilterChange: handleFilterChange,
    sortingMode: 'server',
    onSortModelChange: handleSortModelChange,
    pageSizeOptions: [tableOptions.defaultItemsPerPage, 50, 100],
    onExport: handleExport,
  };

  return {
    ...query,
    data: query.data?.data,
    serverSideOptions,
  } as UseTableQueryResult<TData['data'], TError>;
};
