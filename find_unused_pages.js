const fs = require('fs');
const path = require('path');

const projectDir = 'f:\\国外兼职项目\\kuaizi_uniapp';
const pagesDir = path.join(projectDir, 'pages');

// 读取 pages.json
const pagesJsonPath = path.join(projectDir, 'pages.json');
const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

// 从 pages.json 中提取所有注册的页面路径
const registeredPages = new Set();
pagesJson.pages.forEach(page => {
    registeredPages.add(page.path);
});

console.log('=== pages.json 中注册的页面 ===');
console.log('总数:', registeredPages.size);
console.log('');

// 获取 pages 目录下所有实际存在的页面
const actualPages = new Set();

function scanPagesDir(dir, prefix = 'pages') {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            // 排除 components 目录
            if (item.name !== 'components') {
                scanPagesDir(path.join(dir, item.name), prefix + '/' + item.name);
            }
        } else if (item.isFile() && item.name.endsWith('.vue')) {
            // 移除 .vue 后缀
            const pagePath = prefix + '/' + item.name.replace('.vue', '');
            actualPages.add(pagePath);
        }
    }
}

scanPagesDir(pagesDir);

console.log('=== 实际存在的页面文件 ===');
console.log('总数:', actualPages.size);
console.log('');

// 找出未在 pages.json 中注册的页面
const unregisteredPages = [];
for (const page of actualPages) {
    if (!registeredPages.has(page)) {
        unregisteredPages.push(page);
    }
}

// 搜索代码中的页面跳转引用
const usedPages = new Set([...registeredPages]); // 先把所有注册的页面加入

function searchPageReferences(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            if (!['node_modules', '.git', 'unpackage', '.hbuilderx'].includes(item.name)) {
                searchPageReferences(fullPath);
            }
        } else if (item.isFile() && /\.(vue|js|ts|jsx|tsx|nvue)$/i.test(item.name)) {
            try {
                const content = fs.readFileSync(fullPath, 'utf-8');
                
                // 匹配各种页面跳转方式
                const patterns = [
                    /navigateTo.*?['"`]([^'"`]+?)['"`]/g,
                    /redirectTo.*?['"`]([^'"`]+?)['"`]/g,
                    /reLaunch.*?['"`]([^'"`]+?)['"`]/g,
                    /switchTab.*?['"`]([^'"`]+?)['"`]/g,
                    /url:\s*['"`]([^'"`]+?)['"`]/g,
                    /path:\s*['"`]([^'"`]+?)['"`]/g,
                ];
                
                for (const pattern of patterns) {
                    const matches = content.matchAll(pattern);
                    for (const match of matches) {
                        let url = match[1];
                        // 移除查询参数
                        url = url.split('?')[0];
                        // 移除开头的 /
                        url = url.replace(/^\//, '');
                        if (url.startsWith('pages/')) {
                            usedPages.add(url);
                        }
                    }
                }
            } catch (e) {
                // 忽略读取错误
            }
        }
    }
}

searchPageReferences(projectDir);

// 找出未被引用的已注册页面
const unusedRegisteredPages = [];
for (const page of registeredPages) {
    // 排除 tabBar 页面和首页
    const isTabBarPage = pagesJson.tabBar.list.some(tab => tab.pagePath === page);
    const isIndexPage = page === 'pages/index/index';
    
    if (!isTabBarPage && !isIndexPage && !usedPages.has(page)) {
        unusedRegisteredPages.push(page);
    }
}

console.log('=== 未在 pages.json 中注册的页面 ===');
console.log('总数:', unregisteredPages.length);
if (unregisteredPages.length > 0) {
    unregisteredPages.forEach(page => console.log(page));
}
console.log('');

console.log('=== 已注册但可能未使用的页面 ===');
console.log('总数:', unusedRegisteredPages.length);
if (unusedRegisteredPages.length > 0) {
    unusedRegisteredPages.forEach(page => console.log(page));
}
console.log('');

console.log('=== 代码中被引用的页面 ===');
console.log('总数:', usedPages.size);

// 保存结果
const result = {
    unregisteredPages,
    unusedRegisteredPages
};

fs.writeFileSync(
    path.join(projectDir, 'unused_pages_report.json'),
    JSON.stringify(result, null, 2),
    'utf-8'
);

console.log('\n分析报告已保存到: unused_pages_report.json');
