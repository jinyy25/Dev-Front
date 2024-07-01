export interface Tab {
  name: string,
  value: ('file' | 'url')[],
}
export const tabs: Tab[] = [
  { name: 'From This Device', value: ['file'] },
  { name: 'From the Web', value: ['url'] },
  { name: 'Both', value: ['file', 'url'] },
];

export const markup = ``;

export const tabLabel = { 'aria-label': 'Tab' };
