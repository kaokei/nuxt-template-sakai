export interface Problem {
  id: string;
  problemNumber: string;
  title: string;
  owner: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptanceRate: number;
  submissions: number;
  timeLimit: number;
  memoryLimit: number;
  createTime: string;
  lastModifiedTime: string;
  accessLevel: 'Public' | 'Private' | 'Shared';
  description: string;
}

export interface ProblemQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  problemNumber?: string;
  title?: string;
  owner?: string;
  difficulty?: string;
  tags?: string[];
  accessLevel?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

interface ProblemOptions {
  tags: string[];
  difficultyOptions: SelectOption[];
  accessLevelOptions: SelectOption[];
  ownerOptions: SelectOption[];
}

@Injectable()
export class ProblemService {
  private optionsCache: ProblemOptions | null = null;

  private async loadOptions(): Promise<ProblemOptions> {
    if (this.optionsCache) return this.optionsCache;
    this.optionsCache = await $fetch<ProblemOptions>('/api/problems/options');
    return this.optionsCache;
  }

  async getAllTags(): Promise<string[]> {
    const opts = await this.loadOptions();
    return opts.tags;
  }

  async getDifficultyOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.difficultyOptions;
  }

  async getAccessLevelOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.accessLevelOptions;
  }

  async getOwnerOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.ownerOptions;
  }

  async queryProblems(
    params: ProblemQueryParams = {},
  ): Promise<PageResult<Problem>> {
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
    return $fetch('/api/problems', { query });
  }

  async getProblemById(id: string): Promise<Problem | undefined> {
    try {
      return await $fetch(`/api/problems/${id}`);
    } catch {
      return undefined;
    }
  }

  async createProblem(
    data: Omit<
      Problem,
      'id' | 'problemNumber' | 'createTime' | 'lastModifiedTime'
    >,
  ): Promise<Problem> {
    return $fetch('/api/problems', { method: 'POST', body: data });
  }

  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    return $fetch(`/api/problems/${id}`, { method: 'PUT', body: data });
  }

  async deleteProblem(id: string): Promise<boolean> {
    await $fetch(`/api/problems/${id}`, { method: 'DELETE' });
    return true;
  }

  async deleteProblems(ids: string[]): Promise<number> {
    const res = await $fetch('/api/problems/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return (res as { deleted: number }).deleted;
  }
}
