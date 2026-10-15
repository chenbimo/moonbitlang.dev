// moonbitlang.dev — module registry. One entry per shown project; site redeploys on push.
const modules = [
  {
    name: 'bm2',
    description:
      'A lightweight process manager for Bun and Node.js applications, written in MoonBit. Two static binaries, no runtime.',
    repo: 'https://github.com/chenbimo/bm2',
    docs: 'https://bm2.moonbitlang.dev',
  },
  {
    name: 'clitable',
    description: 'Unicode tables for the command line, designed for MoonBit.',
    repo: 'https://github.com/chenbimo/clitable',
  },
];

const grid = document.getElementById('modules');

for (const m of modules) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h2');
  title.textContent = m.name;
  card.append(title);

  const desc = document.createElement('p');
  desc.textContent = m.description;
  card.append(desc);

  const links = document.createElement('p');
  links.className = 'links';
  const repoLink = document.createElement('a');
  repoLink.href = m.repo;
  repoLink.textContent = 'GitHub';
  links.append(repoLink);
  if (m.docs) {
    const sep = document.createTextNode(' · ');
    const docsLink = document.createElement('a');
    docsLink.href = m.docs;
    docsLink.textContent = 'Docs';
    links.append(sep, docsLink);
  }
  card.append(links);

  grid.append(card);
}
