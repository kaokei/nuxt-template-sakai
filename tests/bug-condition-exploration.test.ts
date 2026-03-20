/**
 * Bug 条件探索性测试
 *
 * 目标：扫描 layers/sakai/ 下所有 Vue 文件的 <template> 部分，
 * 检测是否存在无 Prime 前缀的 PrimeVue 组件标签。
 *
 * 预期：在未修复代码上运行时测试失败，证明 bug 存在。
 *
 * Validates: Requirements 1.1, 1.2, 2.1, 2.2
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

// PrimeVue 组件列表（项目中使用的所有 PrimeVue 组件）
const PRIMEVUE_COMPONENTS = [
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
];

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
  const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
  return templateMatch ? templateMatch[1] : '';
}

/**
 * 检测模板中无 Prime 前缀的 PrimeVue 组件标签
 * 返回所有违规项：{ file, component, matches }
 */
function findUnprefixedComponents(
  vueFiles: string[],
): { file: string; component: string; matches: string[] }[] {
  const violations: { file: string; component: string; matches: string[] }[] = [];

  for (const filePath of vueFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const template = extractTemplate(content);
    if (!template) continue;

    const relativePath = path.relative(SCAN_DIR, filePath);

    for (const component of PRIMEVUE_COMPONENTS) {
      // 匹配开标签（包括自闭合）：<ComponentName 或 <ComponentName>
      // 排除已有 Prime 前缀的：不匹配 <PrimeComponentName
      // 使用负向后行断言排除已有 Prime 前缀的情况
      const openTagRegex = new RegExp(
        `<(?!Prime)${component}(?=[\\s/>])`,
        'g',
      );
      // 匹配闭标签：</ComponentName>
      const closeTagRegex = new RegExp(
        `</(?!Prime)${component}\\s*>`,
        'g',
      );

      const openMatches = template.match(openTagRegex) || [];
      const closeMatches = template.match(closeTagRegex) || [];
      const allMatches = [...openMatches, ...closeMatches];

      if (allMatches.length > 0) {
        violations.push({
          file: relativePath,
          component,
          matches: allMatches,
        });
      }
    }
  }

  return violations;
}

describe('Bug 条件探索性测试：PrimeVue 组件前缀检查', () => {
  const vueFiles = getVueFiles(SCAN_DIR);

  it('layers/sakai/ 下应存在 Vue 文件', () => {
    expect(vueFiles.length).toBeGreaterThan(0);
  });

  it('所有 PrimeVue 组件标签应使用 Prime 前缀（无前缀标签数量应为 0）', () => {
    const violations = findUnprefixedComponents(vueFiles);

    // 输出发现的反例，便于调试
    if (violations.length > 0) {
      console.log('\n=== 发现的无前缀 PrimeVue 组件标签（反例） ===');
      for (const v of violations) {
        console.log(`  文件: ${v.file}`);
        console.log(`    组件: ${v.component}`);
        console.log(`    匹配: ${v.matches.join(', ')}`);
      }
      console.log(`\n  共计 ${violations.length} 处违规`);
      console.log('=== 反例列表结束 ===\n');
    }

    // 断言：不应存在无前缀的 PrimeVue 组件标签
    expect(
      violations,
      `发现 ${violations.length} 处无 Prime 前缀的 PrimeVue 组件标签`,
    ).toHaveLength(0);
  });

  it('每个 Vue 文件中的 PrimeVue 组件开标签和闭标签都应有 Prime 前缀', () => {
    const violations = findUnprefixedComponents(vueFiles);

    // 按文件分组检查
    const fileMap = new Map<string, { component: string; matches: string[] }[]>();
    for (const v of violations) {
      if (!fileMap.has(v.file)) {
        fileMap.set(v.file, []);
      }
      fileMap.get(v.file)!.push({ component: v.component, matches: v.matches });
    }

    // 断言：每个文件都不应有无前缀的 PrimeVue 组件
    expect(
      fileMap.size,
      `${fileMap.size} 个文件中存在无前缀的 PrimeVue 组件标签`,
    ).toBe(0);
  });
});
