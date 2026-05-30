import type { CertificateTemplate } from '@sakai/types/certificate';
import { HttpResponse, http } from 'msw';
import { mockCertificateTemplates } from '../data/certificate-templates';

let templates: CertificateTemplate[] = JSON.parse(
  JSON.stringify(mockCertificateTemplates),
) as CertificateTemplate[];
let nextId = templates.length + 1;

export const certificateHandlers = [
  http.get('/api/certificate-templates', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const category = url.searchParams.get('category') || '';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = [...templates];

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(kw) ||
          (t.description && t.description.toLowerCase().includes(kw)),
      );
    }

    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ data, total });
  }),

  http.get('/api/certificate-templates/options', () => {
    const options = templates.map((t) => ({
      label: t.name,
      value: t.id,
      category: t.category,
    }));
    return HttpResponse.json(options);
  }),

  http.get('/api/certificate-templates/:id', ({ params }) => {
    const tpl = templates.find((t) => t.id === params.id);
    if (!tpl) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(tpl);
  }),

  http.post('/api/certificate-templates', async ({ request }) => {
    const body = (await request.json()) as Omit<
      CertificateTemplate,
      'id' | 'createdAt' | 'updatedAt'
    >;
    const now = new Date().toISOString();
    const newTpl: CertificateTemplate = {
      ...body,
      id: `tpl-${String(nextId++).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    templates.unshift(newTpl);
    return HttpResponse.json(newTpl, { status: 201 });
  }),

  http.put('/api/certificate-templates/:id', async ({ request, params }) => {
    const index = templates.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Partial<CertificateTemplate>;
    const { id: _id, ...rest } = body;
    templates[index] = {
      ...templates[index],
      ...rest,
      updatedAt: new Date().toISOString(),
    } as CertificateTemplate;
    return HttpResponse.json(templates[index]);
  }),

  http.delete('/api/certificate-templates/:id', ({ params }) => {
    const index = templates.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    templates.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
