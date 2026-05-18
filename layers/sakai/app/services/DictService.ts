export interface DictType {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  remark: string;
  createTime: string;
}

export interface DictData {
  id: string;
  typeCode: string;
  label: string;
  value: string;
  valueType: 'string' | 'number';
  extValue: string;
  order: number;
  cssClass: string;
  listClass: 'success' | 'info' | 'warn' | 'danger' | '';
  isDefault: boolean;
  status: 'active' | 'inactive';
  remark: string;
  createTime: string;
}

export interface DictTypeQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  code?: string;
  status?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface DictDataQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  typeCode?: string;
  label?: string;
  value?: string;
  status?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface DeleteResult {
  success: true;
  message: string;
}

export interface TypeDeleteResult {
  success: true;
  deletedDataCount: number;
  typeName: string;
}

export interface BatchDeleteResult {
  success: true;
  deletedTypes: number;
  deletedDatas: number;
}

@Injectable()
export class DictService {
  // ==================== 字典类型 API ====================

  async queryTypes(
    params: DictTypeQueryParams = {},
  ): Promise<PageResult<DictType>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] = String(value);
      }
    }
    return $fetch('/api/dict/types', { query });
  }

  async getTypeById(id: string): Promise<DictType | undefined> {
    try {
      return await $fetch(`/api/dict/types/${id}`);
    } catch {
      return undefined;
    }
  }

  async createType(
    data: Omit<DictType, 'id' | 'createTime'>,
  ): Promise<DictType> {
    return $fetch('/api/dict/types', { method: 'POST', body: data });
  }

  async updateType(id: string, data: Partial<DictType>): Promise<DictType> {
    return $fetch(`/api/dict/types/${id}`, { method: 'PUT', body: data });
  }

  async deleteType(id: string): Promise<TypeDeleteResult> {
    return $fetch(`/api/dict/types/${id}`, { method: 'DELETE' });
  }

  async deleteTypes(ids: string[]): Promise<BatchDeleteResult> {
    return $fetch('/api/dict/types/batch-delete', {
      method: 'POST',
      body: { ids },
    });
  }

  // ==================== 字典数据 API ====================

  async queryData(
    params: DictDataQueryParams = {},
  ): Promise<PageResult<DictData>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] = String(value);
      }
    }
    return $fetch('/api/dict/data', { query });
  }

  async getDataById(id: string): Promise<DictData | undefined> {
    try {
      return await $fetch(`/api/dict/data/${id}`);
    } catch {
      return undefined;
    }
  }

  async createData(
    data: Omit<DictData, 'id' | 'createTime'>,
  ): Promise<DictData> {
    return $fetch('/api/dict/data', { method: 'POST', body: data });
  }

  async updateData(id: string, data: Partial<DictData>): Promise<DictData> {
    return $fetch(`/api/dict/data/${id}`, { method: 'PUT', body: data });
  }

  async deleteData(id: string): Promise<boolean> {
    await $fetch(`/api/dict/data/${id}`, { method: 'DELETE' });
    return true;
  }

  async deleteDatas(ids: string[]): Promise<number> {
    const res = await $fetch('/api/dict/data/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return (res as { deleted: number }).deleted;
  }
}
