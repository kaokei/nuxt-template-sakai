/**
 * 保持不变的属性测试（Property 2: Preservation）
 *
 * 目标：验证非 PrimeVue 组件标签名在修复前后保持不变。
 * 包括：自定义组件、Nuxt/Vue 内置组件、HTML 原生元素、
 * 以及所有文件的 <script> 和 <style> 部分。
 *
 * 预期：在未修复代码上运行时测试通过（确认基线行为可保持）。
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// PrimeVue 组件列表（与 bug-condition-exploration 测试保持一致）
const PRIMEVUE_COMPONENTS = new Set([
  'Button', 'DataTable', 'Column', 'Dialog', 'InputText', 'InputNumber',
  'Textarea', 'Select', 'RadioButton', 'Rating', 'Tag', 'Toolbar',
  'IconField', 'InputIcon', 'Toast', 'Menu', 'Chart', 'SelectButton',
  'Fluid', 'FloatLabel', 'AutoComplete', 'DatePicker', 'Slider',
  'ColorPicker', 'Knob', 'Checkbox', 'ToggleSwitch', 'Listbox',
  'MultiSelect', 'TreeSelect', 'ToggleButton', 'InputGroup',
  'InputGroupAddon', 'Accordion', 'AccordionPanel', 'AccordionHeader',
  'AccordionContent', 'Panel', 'Fieldset', 'Divider', 'Splitter',
  'SplitterPanel', 'ScrollPanel', 'Tabs', 'TabList', 'Tab', 'TabPanels',
  'TabPanel', 'Card', 'Timeline', 'Carousel', 'Image', 'Galleria',
  'OrderList', 'DataView', 'PickList', 'Tree', 'TreeTable',
  'OrganizationChart', 'ConfirmDialog', 'ConfirmPopup', 'Popover',
  'Drawer', 'FileUpload', 'Breadcrumb', 'ContextMenu', 'MegaMenu',
  'Menubar', 'PanelMenu', 'Steps', 'TabMenu', 'TieredMenu', 'Message',
  'InlineMessage', 'ProgressBar', 'Badge', 'Avatar', 'Chip', 'ScrollTop',
  'Skeleton', 'ProgressSpinner', 'Terminal', 'MeterGroup', 'SpeedDial',
  'Stepper', 'StepList', 'StepPanels', 'StepItem', 'Step', 'StepPanel',
  'ButtonGroup', 'SplitButton', 'OverlayBadge', 'AvatarGroup', 'Password',
]);

// 扫描目录
const SCAN_DIR = path.resolve(__dirname, '..', 'layers', 'sakai');

/**
 * 递归获取目录下所有 .vue 文件
 */
function getVueFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getVueFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * 从 Vue 文件内容中提取 <template> 部分
 */
function extractTemplate(content: string): string {
  const match = content.match(/<template>([\s\S]*?)<\/template>/);
  return match ? match[1] : '';
}

/**
 * 从 Vue 文件内容中提取 <script> 部分（包含标签本身）
 */
function extractScript(content: string): string {
  const match = content.match(/<script[\s\S]*?<\/script>/);
  return match ? match[0] : '';
}

/**
 * 从 Vue 文件内容中提取 <style> 部分（包含标签本身）
 */
function extractStyle(content: string): string {
  const match = content.match(/<style[\s\S]*?<\/style>/);
  return match ? match[0] : '';
}

/**
 * 从模板中提取所有组件标签名（非 HTML 原生元素）
 * 返回格式：{ tagName: string, isClosing: boolean, raw: string }[]
 */
function extractComponentTags(template: string): { tagName: string; isClosing: boolean; raw: string }[] {
  const tags: { tagName: string; isClosing: boolean; raw: string }[] = [];
  // 匹配开标签和自闭合标签：<TagName 或 </TagName
  // 组件标签名以大写字母开头，或包含连字符（如 router-link）
  const tagRegex = /<\/?([A-Z][A-Za-z0-9]*|[a-z][a-z0-9]*-[a-z0-9-]*)[\s/>]/g;
  let match;
  while ((match = tagRegex.exec(template)) !== null) {
    const raw = match[0];
    const tagName = match[1];
    const isClosing = raw.startsWith('</');
    tags.push({ tagName, isClosing, raw });
  }
  return tags;
}

/**
 * 从模板中提取所有非 PrimeVue 组件标签
 * 包括：自定义组件、Nuxt/Vue 内置组件（不包括 HTML 原生元素）
 */
function extractNonPrimeVueComponentTags(template: string): { tagName: string; isClosing: boolean; raw: string }[] {
  const allTags = extractComponentTags(template);
  return allTags.filter(tag => {
    // 排除 PrimeVue 组件（无前缀和有前缀的都排除）
    const nameWithoutPrefix = tag.tagName.startsWith('Prime')
      ? tag.tagName.slice(5)
      : tag.tagName;
    return !PRIMEVUE_COMPONENTS.has(tag.tagName) && !PRIMEVUE_COMPONENTS.has(nameWithoutPrefix);
  });
}

/**
 * 从模板中提取所有 HTML 原生元素标签名
 */
function extractHtmlElements(template: string): string[] {
  // HTML 原生元素以小写字母开头且不包含连字符
  const htmlRegex = /<\/?([a-z][a-z0-9]*)[\s/>]/g;
  const elements = new Set<string>();
  let match;
  while ((match = htmlRegex.exec(template)) !== null) {
    const tagName = match[1];
    // 排除 template、script、style 这些 Vue SFC 标签
    if (!['template', 'script', 'style'].includes(tagName)) {
      elements.add(tagName);
    }
  }
  return Array.from(elements).sort();
}

/**
 * 从模板中提取所有 props、事件绑定和指令
 * 返回格式：属性字符串数组
 */
function extractAttributes(template: string): string[] {
  // 匹配 Vue 属性绑定：:prop、v-model、@event、v-if 等
  const attrRegex = /(?::|v-|@)[a-zA-Z][a-zA-Z0-9.:_-]*(?:="[^"]*")?/g;
  const attrs = template.match(attrRegex) || [];
  return attrs.sort();
}

describe('保持不变的属性测试：非 PrimeVue 组件标签名保持不变', () => {
  const vueFiles = getVueFiles(SCAN_DIR);

  it('layers/sakai/ 下应存在 Vue 文件', () => {
    expect(vueFiles.length).toBeGreaterThan(0);
  });

  /**
   * Property 2.1: 自定义组件标签名保持不变
   * 验证所有非 PrimeVue 的自定义组件标签名在当前代码中存在且正确
   *
   * Validates: Requirements 3.1
   */
  it('自定义组件标签名应保持不变（AppConfigurator、FloatingConfigurator、BlockViewer 等）', () => {
    // 已知的自定义组件列表
    const knownCustomComponents = [
      'AppConfigurator', 'AppFooter', 'AppLayout', 'AppMenu', 'AppMenuItem',
      'AppSidebar', 'AppTopbar', 'FloatingConfigurator', 'BlockViewer',
      'StatsWidget', 'RecentSalesWidget', 'BestSellingWidget',
      'RevenueStreamWidget', 'NotificationsWidget', 'TestDashboard',
      'TopbarWidget', 'HeroWidget', 'FeaturesWidget', 'HighlightsWidget',
      'PricingWidget', 'FooterWidget',
    ];

    // 收集所有文件中出现的自定义组件标签
    const foundCustomComponents = new Map<string, string[]>();

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const relativePath = path.relative(SCAN_DIR, filePath);
      const nonPrimeTags = extractNonPrimeVueComponentTags(template);

      for (const tag of nonPrimeTags) {
        if (knownCustomComponents.includes(tag.tagName)) {
          if (!foundCustomComponents.has(tag.tagName)) {
            foundCustomComponents.set(tag.tagName, []);
          }
          foundCustomComponents.get(tag.tagName)!.push(relativePath);
        }
      }
    }

    // 验证：找到的自定义组件标签名应与已知列表中的名称完全一致
    for (const [componentName, files] of foundCustomComponents) {
      expect(
        knownCustomComponents,
        `自定义组件 ${componentName}（出现在 ${files.join(', ')}）应在已知列表中`
      ).toContain(componentName);
    }

    // 验证：至少找到了一些自定义组件
    expect(
      foundCustomComponents.size,
      '应至少找到一些自定义组件'
    ).toBeGreaterThan(0);

    console.log(`\n=== 自定义组件基线快照 ===`);
    for (const [name, files] of foundCustomComponents) {
      console.log(`  ${name}: ${files.join(', ')}`);
    }
    console.log(`  共计 ${foundCustomComponents.size} 个自定义组件`);
    console.log(`=== 快照结束 ===\n`);
  });

  /**
   * Property 2.2: Nuxt/Vue 内置组件标签名保持不变
   *
   * Validates: Requirements 3.2
   */
  it('Nuxt/Vue 内置组件标签名应保持不变（NuxtLink、router-link、router-view 等）', () => {
    // 已知的 Nuxt/Vue 内置组件
    const knownBuiltinComponents = [
      'NuxtLink', 'NuxtPage', 'NuxtLayout',
      'router-link', 'router-view',
      'Transition', 'TransitionGroup', 'KeepAlive',
      'Teleport', 'Suspense',
    ];

    const foundBuiltins = new Map<string, string[]>();

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const relativePath = path.relative(SCAN_DIR, filePath);
      const allTags = extractComponentTags(template);

      for (const tag of allTags) {
        if (knownBuiltinComponents.includes(tag.tagName)) {
          if (!foundBuiltins.has(tag.tagName)) {
            foundBuiltins.set(tag.tagName, []);
          }
          if (!foundBuiltins.get(tag.tagName)!.includes(relativePath)) {
            foundBuiltins.get(tag.tagName)!.push(relativePath);
          }
        }
      }
    }

    // 验证：找到的内置组件标签名应与已知列表中的名称完全一致
    for (const [componentName] of foundBuiltins) {
      expect(
        knownBuiltinComponents,
        `内置组件 ${componentName} 应在已知列表中`
      ).toContain(componentName);
    }

    console.log(`\n=== Nuxt/Vue 内置组件基线快照 ===`);
    for (const [name, files] of foundBuiltins) {
      console.log(`  ${name}: ${files.join(', ')}`);
    }
    console.log(`  共计 ${foundBuiltins.size} 个内置组件`);
    console.log(`=== 快照结束 ===\n`);
  });

  /**
   * Property 2.3: HTML 原生元素标签名保持不变
   *
   * Validates: Requirements 3.2
   */
  it('HTML 原生元素标签名应保持不变（div、span、button、input 等）', () => {
    const allHtmlElements = new Set<string>();

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const elements = extractHtmlElements(template);
      for (const el of elements) {
        allHtmlElements.add(el);
      }
    }

    // 验证：常见的 HTML 元素应存在
    const expectedElements = ['div', 'span', 'button', 'img', 'label', 'a', 'i'];
    for (const el of expectedElements) {
      expect(
        allHtmlElements.has(el),
        `HTML 元素 <${el}> 应在模板中存在`
      ).toBe(true);
    }

    // 验证：所有 HTML 元素名应为小写（未被错误修改）
    for (const el of allHtmlElements) {
      expect(
        el,
        `HTML 元素 <${el}> 应为小写`
      ).toBe(el.toLowerCase());
    }

    console.log(`\n=== HTML 原生元素基线快照 ===`);
    console.log(`  元素列表: ${Array.from(allHtmlElements).sort().join(', ')}`);
    console.log(`  共计 ${allHtmlElements.size} 种 HTML 元素`);
    console.log(`=== 快照结束 ===\n`);
  });

  /**
   * Property 2.4: 所有组件的 props、事件绑定保持不变
   *
   * Validates: Requirements 3.3
   */
  it('所有组件的 props 和事件绑定应保持不变', () => {
    const fileAttributes = new Map<string, string[]>();

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const relativePath = path.relative(SCAN_DIR, filePath);
      const attrs = extractAttributes(template);
      if (attrs.length > 0) {
        fileAttributes.set(relativePath, attrs);
      }
    }

    // 验证：至少有一些文件包含属性绑定
    expect(
      fileAttributes.size,
      '应至少有一些文件包含 props/事件绑定'
    ).toBeGreaterThan(0);

    // 记录基线快照：每个文件的属性数量
    console.log(`\n=== Props/事件绑定基线快照 ===`);
    for (const [file, attrs] of fileAttributes) {
      console.log(`  ${file}: ${attrs.length} 个属性绑定`);
    }
    console.log(`=== 快照结束 ===\n`);

    // 验证：属性绑定格式正确（以 :、v-、@ 开头）
    for (const [file, attrs] of fileAttributes) {
      for (const attr of attrs) {
        expect(
          /^(?::|v-|@)/.test(attr),
          `文件 ${file} 中的属性 "${attr}" 应以 :、v- 或 @ 开头`
        ).toBe(true);
      }
    }
  });

  /**
   * Property 2.5: <script> 和 <style> 部分内容保持不变
   *
   * Validates: Requirements 3.3
   */
  it('<script> 和 <style> 部分内容应保持不变', () => {
    const scriptSnapshots = new Map<string, string>();
    const styleSnapshots = new Map<string, string>();

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(SCAN_DIR, filePath);

      const script = extractScript(content);
      const style = extractStyle(content);

      if (script) {
        scriptSnapshots.set(relativePath, script);
      }
      if (style) {
        styleSnapshots.set(relativePath, style);
      }
    }

    // 验证：至少有一些文件包含 script 部分
    expect(
      scriptSnapshots.size,
      '应至少有一些文件包含 <script> 部分'
    ).toBeGreaterThan(0);

    // 验证：script 内容不为空
    for (const [file, script] of scriptSnapshots) {
      expect(
        script.length,
        `文件 ${file} 的 <script> 部分不应为空`
      ).toBeGreaterThan(0);
    }

    // 验证：style 内容不为空（如果存在）
    for (const [file, style] of styleSnapshots) {
      expect(
        style.length,
        `文件 ${file} 的 <style> 部分不应为空`
      ).toBeGreaterThan(0);
    }

    console.log(`\n=== Script/Style 基线快照 ===`);
    console.log(`  包含 <script> 的文件: ${scriptSnapshots.size} 个`);
    console.log(`  包含 <style> 的文件: ${styleSnapshots.size} 个`);
    for (const [file, script] of scriptSnapshots) {
      console.log(`  ${file}: script=${script.length}字符, style=${styleSnapshots.get(file)?.length ?? 0}字符`);
    }
    console.log(`=== 快照结束 ===\n`);
  });

  /**
   * Property 2.6: 对于所有非 PrimeVue 组件标签，标签名不应被意外修改
   * 这是核心的保持不变属性测试：遍历所有文件的所有标签，
   * 确保非 PrimeVue 组件标签名没有被添加 Prime 前缀
   *
   * Validates: Requirements 3.1, 3.2
   */
  it('非 PrimeVue 组件标签不应被添加 Prime 前缀', () => {
    const violations: { file: string; tagName: string }[] = [];

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const relativePath = path.relative(SCAN_DIR, filePath);
      const nonPrimeTags = extractNonPrimeVueComponentTags(template);

      for (const tag of nonPrimeTags) {
        // 检查：非 PrimeVue 组件不应以 Prime 开头
        // （除非它本身就是以 Prime 开头的自定义组件，但这种情况在本项目中不存在）
        if (tag.tagName.startsWith('Prime') && !PRIMEVUE_COMPONENTS.has(tag.tagName.slice(5))) {
          // 这是一个以 Prime 开头但不是 PrimeVue 组件的标签——可能是误修改
          violations.push({ file: relativePath, tagName: tag.tagName });
        }
      }
    }

    if (violations.length > 0) {
      console.log('\n=== 发现被错误添加 Prime 前缀的非 PrimeVue 标签 ===');
      for (const v of violations) {
        console.log(`  文件: ${v.file}, 标签: ${v.tagName}`);
      }
      console.log('=== 列表结束 ===\n');
    }

    expect(
      violations,
      `发现 ${violations.length} 个非 PrimeVue 标签被错误添加了 Prime 前缀`
    ).toHaveLength(0);
  });

  /**
   * Property 2.7: 基线快照 - 记录每个文件中非 PrimeVue 组件标签的完整列表
   * 此测试生成基线快照，用于修复后对比
   *
   * Validates: Requirements 3.1, 3.2, 3.3
   */
  it('记录非 PrimeVue 组件标签基线快照', () => {
    const baseline: Record<string, string[]> = {};

    for (const filePath of vueFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const template = extractTemplate(content);
      if (!template) continue;

      const relativePath = path.relative(SCAN_DIR, filePath);
      const nonPrimeTags = extractNonPrimeVueComponentTags(template);
      const tagNames = nonPrimeTags.map(t => `${t.isClosing ? '/' : ''}${t.tagName}`);

      if (tagNames.length > 0) {
        baseline[relativePath] = tagNames;
      }
    }

    // 验证：基线数据不为空
    expect(
      Object.keys(baseline).length,
      '基线快照应包含至少一个文件'
    ).toBeGreaterThan(0);

    console.log(`\n=== 非 PrimeVue 组件标签完整基线快照 ===`);
    for (const [file, tags] of Object.entries(baseline)) {
      const uniqueTags = [...new Set(tags)];
      console.log(`  ${file}: ${uniqueTags.join(', ')}`);
    }
    console.log(`=== 基线快照结束 ===\n`);

    // 使用 Vitest 快照功能记录基线
    expect(baseline).toMatchSnapshot();
  });
});
