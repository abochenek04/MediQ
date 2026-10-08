import ts from 'typescript';
import {readdirSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const codes=['es','zh','ar','pl','gu','hi'];
const legacySource=readFileSync('src/context/interfaceTranslations.ts','utf8');
const legacy=JSON.parse(legacySource.slice(legacySource.indexOf('{'),legacySource.lastIndexOf('}')+1));
const catalogs=Object.fromEntries(codes.map(code=>[code,JSON.parse(readFileSync(`src/context/locales/${code}.json`,'utf8'))]));
const keys=new Set();
const baseKeys=['findCare','saved','reportWait','howItWorks','language','heroEyebrow','heroTitle','heroBody','searchPlaceholder'];
function collect(node){if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))keys.add(node.text);else if(ts.isConditionalExpression(node)){collect(node.whenTrue);collect(node.whenFalse);}}
function scan(path){for(const item of readdirSync(path,{withFileTypes:true})){const file=`${path}/${item.name}`;if(item.isDirectory())scan(file);else if(file.endsWith('.tsx')){const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);function walk(node){if(ts.isCallExpression(node)&&node.expression.getText(source)==='t'&&node.arguments[0])collect(node.arguments[0]);ts.forEachChild(node,walk);}walk(source);}}}
scan('src');
for(const key of JSON.parse(readFileSync('src/context/healthcareKeys.json','utf8')))keys.add(key);
const seed=ts.createSourceFile('seed.ts',readFileSync('server/seed.ts','utf8'),ts.ScriptTarget.Latest,true);
function seeded(node){if(ts.isVariableDeclaration(node)&&node.name.getText(seed)==='tasks'&&node.initializer&&ts.isArrayLiteralExpression(node.initializer)){for(const row of node.initializer.elements)if(ts.isArrayLiteralExpression(row))for(const value of row.elements.slice(1))collect(value);}ts.forEachChild(node,seeded);}
seeded(seed);
for(const key of ['Clinic details','Page not found'])keys.add(key);
const missing=[];
for(const key of keys){for(const code of codes){const translated=catalogs[code][key]||(['es','zh','ar'].includes(code)?legacy[key]?.[['es','zh','ar'].indexOf(code)]:null);if(!translated&&!baseKeys.includes(key))missing.push(`${code}: ${key}`);if(translated){const placeholders=s=>[...s.matchAll(/\{([^{}]+)\}/g)].map(m=>m[1]).sort();assert.deepEqual(placeholders(translated),placeholders(key),`Interpolation mismatch: ${code} ${key}`);}}}
assert.deepEqual(missing,[],`Missing translations:\n${missing.join('\n')}`);
console.log(`Translated static/conditional UI keys and interpolation verified: ${keys.size} keys × 6 translated locales.`);
