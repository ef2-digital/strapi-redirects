export interface PaginationObject {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface Response {
  data:
    | {
        source: string;
        destination: string;
      }[]
    | [];
  meta: PaginationObject;
  error?: string;
}
